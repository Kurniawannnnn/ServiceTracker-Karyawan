const { pd, ps, pn, Rapor } = require('../models/index');

/** call joi library */
const { sequelize } = require('../models/index');

exports.countExecutorPDS = async (req, res) => {
  try {
    const { executor } = req.params;

    const dataPD = await pd.count({
      where: { executor },
    });

    const dataPS = await ps.count({
      where: { executor },
    });

    const dataPN = await pn.count({
      where: { executor },
    });

    const totalData = dataPD + dataPS + dataPN;

    res.json({
      status: true,
      dataPD,
      dataPS,
      dataPN,
      totalData,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

exports.avgMTTRExecutor = async (req, res) => {
  try {
    const startTime = new Date();
    const avgMTTRResult = await Rapor.sequelize.query(
      'SELECT AVG("avgMTTRExecutor") AS avg FROM rapor',
      { type: sequelize.QueryTypes.SELECT }
    );
    const endTime = new Date();
    const executionTimeInMilliseconds = endTime - startTime;
    const formattedExecutionTime = formatExecutionTime(executionTimeInMilliseconds);

    const avgMTTR = avgMTTRResult[0]?.avg || 0;

    res.json({
      status: true,
      avgMTTR,
      executionTime: formattedExecutionTime,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

// Fungsi untuk memformat waktu eksekusi dalam format jam, menit, detik, dan milidetik
function formatExecutionTime(durationInMilliseconds) {
  const hours = Math.floor(durationInMilliseconds / 3600000);
  const minutes = Math.floor((durationInMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((durationInMilliseconds % 60000) / 1000);
  const milliseconds = Math.floor((durationInMilliseconds % 1000));

  return `${hours} jam, ${minutes} menit, ${seconds} detik, ${milliseconds} milidetik`;
}

exports.getAchievementExecutor = async (req, res) => {
  try {
    const { executor } = req.params;

    if (!executor || typeof executor !== 'string') {
      throw new Error('Invalid executor value');
    }

    const countPD = await pd.count({
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

    res.json({
      status: true,
      achievement,
      totalData,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
