const pd = require('../models/index').pds
const jwt = require('jsonwebtoken');

/** function untuk mengolah request dan memberi respon */
const { response, request } = require("express")

/** call joi library */
const joi = require(`joi`)

/**define func to validate input of meja */
const validatePd = async (input) => {
  /** define rules of validation */
  let rules = joi.object().keys({
    subject: joi
      .string()
      .valid('Pembuatan Database Schema', 'Pembuatan Database User', 'Pemberian Hak Akses pada Database User', 'Perubahan Hak Akses pada Database User', 'Penghapusan Hak Akses pada Database User', 'Query Tuning & Review', 'Provisioning Database Object', 'Maintenance Support', 'Pembuatan Report Database', 'Pembuatan Database Instance', 'Pebuatan Data Retensi & Housekeeping', 'Migrasi Database/Data', 'Implementasi Fitur Database', 'Patching/Update Database')
      .required(),
    assignment: joi.string().required(),
    status: joi
      .string()
      .valid('On Progress', 'Done')
      .required(),
    requester: joi.string().required(),
    executor: joi.string().required()
  })

  /** validation proses */
  let { error } = rules.validate(input)

  if (error) {
    /** arrange a error message if validation */
    let message = error
      .details
      .map(item => item.message)
      .join(`,`)
    return {
      status: false,
      message: message
    }
  }
  return { status: true }
}

exports.getPd = async (request, response) => {
  try {
    // Ambil token JWT dari header Authorization
    const token = request.headers.authorization.split(" ")[1];

    // Verifikasi token JWT
    const decodedToken = jwt.verify(token, 'sixnature joss');

    // Ambil username dan role dari token JWT yang terdekripsi
    const { username, role } = decodedToken;

    if (!username || !role) {
      return response.json({
        status: false,
        message: "Username or role not found in the token."
      });
    }

    if (role === "User") {
      // Filter data pd berdasarkan executor yang sesuai dengan username
      const pdData = await pd.findAll({ where: { executor: username } });
      return response.json({
        status: true,
        data: pdData,
      });
    } else {
      // Tampilkan semua data pd tanpa filter
      const allPdData = await pd.findAll();
      return response.json({
        status: true,
        data: allPdData,
      });
    }
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.addPd = async (req, res) => {
  try {
    let resultValidation = validatePd(request.body)
    if (resultValidation.status == false) {
      return response.json({
        status: false,
        message: await resultValidation.message
      })
    }
    // Menambahkan data baru menggunakan create
    const newPd = await pd.create(req.body);
    res.json({
      status: true,
      data: newPd,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

exports.updatePd = async (req, res) => {
  const { id } = req.params;
  try {
    // Mengupdate data berdasarkan executor
    let resultValidation = validatePd(req.body);
    if (resultValidation.status === false) {
      return res.json({
        status: false,
        message: await resultValidation.message,
      });
    }

    const [updatedRows] = await pd.update(req.body, {
      where: { id },
    });

    if (updatedRows > 0) {
      res.json({
        status: true,
        message: 'Data berhasil diubah',
      });
    } else {
      res.json({
        status: false,
        message: 'Data tidak ditemukan',
      });
    }
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

exports.deletePd = async (req, res) => {
  const { id } = req.params;
  try {
    let resultValidation = validatePd(request.body)
    if (resultValidation.status == false) {
      return response.json({
        status: false,
        message: await resultValidation.message
      })
    }
    // Menghapus data berdasarkan executor
    const deletedRows = await pd.destroy({
      where: { id },
    });

    if (deletedRows > 0) {
      res.json({
        status: true,
        message: 'Data berhasil dihapus',
      });
    } else {
      res.json({
        status: false,
        message: 'Data tidak ditemukan',
      });
    }
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};