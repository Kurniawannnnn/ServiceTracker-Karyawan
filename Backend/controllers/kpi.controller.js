// Import library atau modul yang diperlukan
const { pds, ps, pn } = require('../models/index');
const { response } = require('express');
const { Op } = require('sequelize');

// Fungsi untuk menghitung rata-rata duration dari data PS dan PD
exports.hitungRataRata = async (req, res) => {
    try {
        // Ambil data duration dari PS
        const dataPS = await ps.findAll({
            attributes: ['duration'],
        });

        const dataPD = await pds.findAll({
            attributes: ['duration'],
        });

        const dataPN = await pn.findAll({
            attributes: ['duration'],
        });

        // Fungsi untuk mengonversi durasi dalam format HH:MM:SS menjadi total detik
        const convertDurationToSeconds = (duration) => {
            const [hours, minutes, seconds] = duration.split(':');
            return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
        };

        // Menghitung total duration dari PS dalam detik
        const totalDurationPS = dataPS.reduce((total, ps) => total + convertDurationToSeconds(ps.duration), 0);

        // Menghitung total duration dari PD dalam detik
        const totalDurationPD = dataPD.reduce((total, pds) => total + convertDurationToSeconds(pds.duration), 0);

        // Menghitung total duration dari PD dalam detik
        const totalDurationPN = dataPN.reduce((total, pn) => total + convertDurationToSeconds(pn.duration), 0);

        // Hitung jumlah total data dari PS dan PD
        const totalDataPS = dataPS.length;
        const totalDataPD = dataPD.length;
        const totalDataPN = dataPN.length;

        // Menghitung rata-rata duration dari PS dan PD dalam detik
        const averageDurationPS = totalDataPS > 0 ? totalDurationPS / totalDataPS : 0;
        const averageDurationPD = totalDataPD > 0 ? totalDurationPD / totalDataPD : 0;
        const averageDurationPN = totalDataPN > 0 ? totalDurationPN / totalDataPN : 0;

        // Menghitung MTTI dari PS dan PD dalam detik
        const totalMTTI = (totalDurationPS + totalDurationPD + totalDurationPN) / (totalDataPS + totalDataPD + totalDataPN);

        const totalData = totalDataPS + totalDataPD + totalDataPN;

        // Menyiapkan respons dengan data rata-rata dan MTTI
        const responseData = {
            averageDurationPS: formatDuration(averageDurationPS),
            averageDurationPD: formatDuration(averageDurationPD),
            averageDurationPN: formatDuration(averageDurationPN),
            totalDataPS,
            totalDataPD,
            totalDataPN,
            totalData,
            MTTI: formatDuration(totalMTTI)
        };

        // Mengirimkan respons dengan status 200 dan data rata-rata serta MTTI
        res.status(200).json(responseData);

    } catch (error) {
        // Mengirimkan respons dengan status 500 jika terjadi kesalahan
        res.status(500).json({ error: 'Error calculating average duration' });
    }
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
