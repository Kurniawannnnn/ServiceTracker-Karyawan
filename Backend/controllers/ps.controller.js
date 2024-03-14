const ps = require('../models/index').ps;
const jwt = require('jsonwebtoken');

/** call joi library */
const joi = require(`joi`);

/**define func to validate input of meja */
const validatePs = async (input) => {
  /** define rules of validation */
  let rules = joi.object().keys({
    subject: joi
      .string()
      .valid(
        'Pembuatan Server', 'Penambahan User Server', 'Penghapusan User Server',
        'Instalasi Aplikasi Server', 'Penghapusan Aplikasi Server',
        'Penambahan Configurasi Aplikasi Server', 'Penambahan User FTP',
        'Penambahan Directory FTP', 'Cloud Migration Support', 'Develop DevSecOps Pipeline'
      )
      .required(),
    assignment: joi.string().required(),
    status: joi
      .string()
      .valid('On Progress', 'Done')
      .required(),
    requester: joi.string().required(),
    executor: joi.string().required()
  });

  /** validation process */
  let { error } = rules.validate(input);

  if (error) {
    /** arrange an error message if validation fails */
    let message = error
      .details
      .map(item => item.message)
      .join(`,`);
    return {
      status: false,
      message: message
    };
  }
  return { status: true };
};

exports.getPs = async (request, response) => {
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
      // Filter data ps berdasarkan executor yang sesuai dengan username
      const psData = await ps.findAll({ where: { executor: username } });
      return response.json({
        status: true,
        data: psData,
      });
    } else {
      // Tampilkan semua data ps tanpa filter
      const allPsData = await ps.findAll();
      return response.json({
        status: true,
        data: allPsData,
      });
    }
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.addPs = async (req, res) => {
  try {
    let resultValidation = validatePs(req.body)
    if (resultValidation.status == false) {
      return response.json({
        status: false,
        message: await resultValidation.message
      })
    }
    // Menambahkan data baru menggunakan create
    const newPs = await ps.create(req.body);
    return res.json({
      status: true,
      data: newPs,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

exports.updatePs = async (req, res) => {
  const { id } = req.params;
  try {
    // Mengupdate data berdasarkan executor
    let resultValidation = validatePs(req.body);
    if (resultValidation.status === false) {
      return res.json({
        status: false,
        message: await resultValidation.message,
      });
    }

    const [updatedRows] = await ps.update(req.body, {
      where: { id },
    });

    if (updatedRows > 0) {
      return res.json({
        status: true,
        message: 'Data berhasil diubah',
      });
    } else {
      return res.json({
        status: false,
        message: 'Data tidak ditemukan',
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

exports.deletePs = async (req, res) => {
  const { id } = req.params;
  try {
    let resultValidation = await validatePs(req.body);
    if (!resultValidation.status == false) {
      return res.json({
        status: false,
        message: resultValidation.message
      });
    }
    // Menghapus data berdasarkan executor
    const deletedRows = await ps.destroy({
      where: { id },
    });

    if (deletedRows > 0) {
      return res.json({
        status: true,
        message: 'Data berhasil dihapus',
      });
    } else {
      return res.json({
        status: false,
        message: 'Data tidak ditemukan',
      });
    }
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};