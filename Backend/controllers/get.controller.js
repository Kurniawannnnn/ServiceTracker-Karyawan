const { pds, ps, pn, Rapor, user } = require('../models/index');
const { response } = require('express');
const { Op } = require('sequelize');

exports.getAllExecutor = async (req, res) => {
  try {
    const executorsData = await getAllExecutorsData();

    const result = await Promise.all(executorsData.map(async (executorData) => {
      const executor = executorData.executor;
      const countPD = await countExecutorPDS(executor);
      const countPS = await countExecutorPS(executor);
      const countPN = await countExecutorPN(executor);
      const totalData = countPD + countPS + countPN;
      const avgMTTR = await avgMTTRExecutor(executor);
      const achievement = await getAchievementExecutor(executor);
      let gambar = null;

      // Cek apakah executor memiliki nama yang sama dengan username pada tabel User
      const userModel = await user.findOne({ where: { username: executor } });
      if (userModel) {
        // Jika ditemukan, ambil data gambar
        gambar = userModel.gambar;
      }

      return {
        executor,
        countPD,
        countPS,
        countPN,
        totalCount: totalData,
        avgMTTR,
        achievement,
        gambar, 
      };
    }));

    res.json({
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

// Fungsi untuk mendapatkan semua executor dari PD dan PS
const getAllExecutorsData = async () => {
  try {
    const pdExecutors = await pds.findAll({
      attributes: ['executor'],
      group: ['executor'],
    });

    const psExecutors = await ps.findAll({
      attributes: ['executor'],
      group: ['executor'],
    });

    const pnExecutors = await pn.findAll({
      attributes: ['executor'],
      group: ['executor'],
    });

    const executorMap = new Map();

    // Proses PD Executors
    pdExecutors.forEach((pdExecutor) => {
      const executor = pdExecutor.executor;
      if (executor && !executorMap.has(executor)) {
        executorMap.set(executor, { executor, pdExecutor, psExecutor: null, pnExecutor: null });
      }
    });

    // Proses PS Executors
    psExecutors.forEach((psExecutor) => {
      const executor = psExecutor.executor;
      if (executor) {
        if (executorMap.has(executor)) {
          // Jika executor sudah ada, tambahkan data PS
          executorMap.get(executor).psExecutor = psExecutor;
        } else {
          // Jika executor belum ada, tambahkan executor baru
          executorMap.set(executor, { executor, pdExecutor: null, psExecutor, pnExecutor: null });
        }
      }
    });

    // Proses PN Executors
    pnExecutors.forEach((pnExecutor) => {
      const executor = pnExecutor.executor;
      if (executor) {
        if (executorMap.has(executor)) {
          // Jika executor sudah ada, tambahkan data PN
          executorMap.get(executor).pnExecutor = pnExecutor;
        } else {
          // Jika executor belum ada, tambahkan executor baru
          executorMap.set(executor, { executor, pdExecutor: null, psExecutor: null, pnExecutor });
        }
      }
    });

    const executorsData = Array.from(executorMap.values());

    return executorsData;
  } catch (error) {
    throw new Error(`Error getting executors data: ${error.message}`);
  }
};

// Fungsi untuk menghitung jumlah PD untuk setiap executor
const countExecutorPDS = async (executor) => {
  if (executor) {
    try {
      const dataPDS = await pds.count({
        where: { executor },
      });
      return dataPDS;
    } catch (error) {
      throw new Error(`Error counting PD for executor ${executor}: ${error.message}`);
    }
  } else {
    return 0;
  }
};

// Fungsi untuk menghitung jumlah PS untuk setiap executor
const countExecutorPS = async (executor) => {
  if (executor) {
    try {
      const dataPS = await ps.count({
        where: { executor },
      });
      return dataPS;
    } catch (error) {
      throw new Error(`Error counting PS for executor ${executor}: ${error.message}`);
    }
  } else {
    return 0;
  }
};

// Fungsi untuk menghitung jumlah PS untuk setiap executor
const countExecutorPN = async (executor) => {
  if (executor) {
    try {
      const dataPN = await pn.count({
        where: { executor },
      });
      return dataPN;
    } catch (error) {
      throw new Error(`Error counting PS for executor ${executor}: ${error.message}`);
    }
  } else {
    return 0;
  }
};

// Fungsi untuk menghitung rata-rata MTTR untuk setiap executor
const avgMTTRExecutor = async (executor) => {
  try {
    const pdDuration = await pds.findAll({
      attributes: ['duration'],
      where: { executor },
    });

    const psDuration = await ps.findAll({
      attributes: ['duration'],
      where: { executor },
    });

    const pnDuration = await pn.findAll({
      attributes: ['duration'],
      where: { executor },
    });

    let totalDuration = 0;
    let totalCount = 0;

    pdDuration.forEach(duration => {
      totalDuration += convertDurationToSeconds(duration.duration);
      totalCount++;
    });

    psDuration.forEach(duration => {
      totalDuration += convertDurationToSeconds(duration.duration);
      totalCount++;
    });

    pnDuration.forEach(duration => {
      totalDuration += convertDurationToSeconds(duration.duration);
      totalCount++;
    });

    const avgMTTRSeconds = totalDuration / totalCount;

    return formatDuration(avgMTTRSeconds);
  } catch (error) {
    throw new Error(`Error calculating avgMTTR for executor ${executor}: ${error.message}`);
  }
};

// Fungsi untuk mengonversi durasi dalam format HH:MM:SS menjadi total detik
const convertDurationToSeconds = (duration) => {
  const [hours, minutes, seconds] = duration.split(':');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};

// Fungsi untuk memformat durasi menjadi format jam:menit:detik
const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

// Fungsi untuk menambahkan 0 di depan angka jika angka < 10
const padZero = (num) => {
  return num < 10 ? '0' + num : num;
};

// Fungsi untuk mendapatkan pencapaian untuk setiap executor
const getAchievementExecutor = async (executor) => {
  try {
    const countPD = await pds.count({
      where: { executor },
    });

    const countPS = await ps.count({
      where: { executor },
    });

    const countPN = await pn.count({
      where: { executor },
    });

    const totalData = countPD + countPS + countPN;
    let achievement = 'Novice';

    if (totalData >= 1 && totalData < 5) {
      achievement = '25.00%';
    } else if (totalData >= 5 && totalData < 10) {
      achievement = '50.00%';
    } else if (totalData >= 10 && totalData < 20) {
      achievement = '75.00%';
    } else if (totalData >= 20) {
      achievement = '100.00%';
    }

    return achievement;
  } catch (error) {
    throw new Error(`Error calculating achievement for executor ${executor}: ${error.message}`);
  }
};
