const pn = require('../models/index').pn;
const jwt = require('jsonwebtoken');

const { response, request } = require("express")

/** call joi library */
const joi = require(`joi`);

/**define func to validate input of meja */
const validatePn = async (input) => {
  /** define rules of validation */
  let rules = joi.object().keys({
    subject: joi
      .string()
      .valid(
        'Penambahan Network Link VPNIP', 'Penambahan Network Link Metro', 'Penambahan Network Link Siteto Site', 'Perubahan Network Link VPNIP', 'Perubahan Network Link Metro', 'Perubahan Network Link Site to Site',
        'Dismantle Network Link VPNIP', 'Dismantle Network Link Metro', 'Dismantle Network Link Siteto Site', 'Penambahan User VPN Cisco', 'Penghapusan User VPN Cisco', 'Penambahan Network NAT Firewall', 'Perubahan Network NAT Firewall',
        'Penghapusan Network NAT Firewall', 'Penambahan Domain', 'Perubahan Domain', 'Penghapusan Domain', 'Penambahan Routing Network', 'Perubahan Routing Network', 'Penghapusan Routing Network', 'Penambahan Record DNS', 'Perubahan Record DNS',
        'Penghapusan Record DNS', 'Penambahan Monitoring Network', 'Perubahan Config Monitoring Network', 'Penghapusan Config Monitoring Network', 'Penambahan Perangkat Network', 'Dismantle Perangkat Network', 'Penambahan DHCP Member Perangkat Kerja',
        'Perubahan DHCP Perangkat Kerja', 'Penambahan Konfigurasi Network GCP', 'Perubahan Konfigurasi Network GCP', 'Penghapusan Konfigurasi Network GCP', 'Provisioning Laptop'
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

exports.getPn = async (request, response) => {
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
      // Filter data pn berdasarkan executor yang sesuai dengan username
      const pnData = await pn.findAll({ where: { executor: username } });
      return response.json({
        status: true,
        data: pnData,
      });
    } else {
      // Tampilkan semua data pn tanpa filter
      const allPnData = await pn.findAll();
      return response.json({
        status: true,
        data: allPnData,
      });
    }
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.addPn = async (req, res) => {
  try {
    let resultValidation = validatePn(req.body)
    if (resultValidation.status == false) {
      return response.json({
        status: false,
        message: await resultValidation.message
      })
    }
    // Menambahkan data baru menggunakan create
    const newPn = await pn.create(req.body);
    return res.json({
      status: true,
      data: newPn,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

exports.updatePn = async (req, res) => {
  const { id } = req.params;
  try {
    // Mengupdate data berdasarkan executor
    let resultValidation = await validatePn(req.body);
    if (!resultValidation.status == false) {
      return res.json({
        status: false,
        message: resultValidation.message,
      });
    }

    const [updatedRows] = await pn.update(req.body, {
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

exports.deletePn = async (req, res) => {
  const { id } = req.params;
  try {
    let resultValidation = await validatePn(req.body);
    if (!resultValidation.status == false) {
      return res.json({
        status: false,
        message: resultValidation.message
      });
    }
    // Menghapus data berdasarkan executor
    const deletedRows = await pn.destroy({
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