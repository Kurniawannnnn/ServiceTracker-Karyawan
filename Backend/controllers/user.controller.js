const { user: UserModel } = require('../models/index');
const joi = require('joi');
const { Op } = require("sequelize")
const md5 = require('md5');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require(`fs`)
const uploadUser = require(`./upload-user`);
const uploadUserMiddleware = uploadUser.single('gambar');

// Middleware untuk verifikasi password
exports.verifyPasswordMiddleware = async (request, response, next) => {
    try {
        const id_user = request.params.id_user;
        const { password } = request.body;

        next();
    } catch (error) {
        response.json({
            status: false,
            message: error.message,
        });
    }
};

// Fungsi untuk verifikasi password (misalnya, endpoint /user/verify/:id_user)
exports.verifyPassword = async (request, response) => {
    try {
        const id_user = request.params.id_user;
        const { password } = request.body;

        // Jika password valid, kirim respons sesuai
        response.json({
            status: true,
            message: 'Verifikasi password berhasil',
        });
    } catch (error) {
        // Tangani error jika terjadi
        response.json({
            status: false,
            message: error.message,
        });
    }
};

let validateUser = async (input) => {
    let rules = joi.object().keys({
        nama_user: joi.string().required(),
        role: joi.string().valid('Admin', 'Engineer', 'User'),
        username: joi.string().required(),
        password: joi.string().min(5),
    });

    let { error } = rules.validate(input);

    if (error) {
        let message = error.details.map(item => item.message).join(',');
        return {
            status: false,
            message: message
        };
    }

    return {
        status: true
    };
};

exports.getUser = async (request, response) => {
    try {
        let result = await UserModel.findAll();
        return response.json({
            status: true,
            data: result
        });
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        });
    }
};

exports.findUser = async (request, response) => {
    try {
        let keyword = request.body.keyword;
        let result = await UserModel.findAll({
            where: {
                [Op.or]: {
                    nama_user: { [Op.substring]: keyword },
                    role: { [Op.substring]: keyword },
                    username: { [Op.substring]: keyword }
                }
            }
        });
        return response.json({
            status: true,
            data: result
        });
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        });
    }
};

exports.addUser = async (request, response) => {
    try {
        let resultValidation = validateUser(request.body);
        if (resultValidation.status === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            });
        }

        const uploadUserImage = uploadUser.single(`gambar`)
        uploadUserImage(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error
                })
            }

            // Lakukan operasi penambahan pengguna setelah upload gambar
            request.body.gambar = request.file.filename;
            request.body.password = md5(request.body.password);
            await UserModel.create(request.body);

            return response.json({
                status: true,
                message: 'Data User Berhasil Ditambahkan'
            });
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        });
    }
};

exports.updateUser = async (request, response) => {
    try {
        uploadUserMiddleware(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error.message
                });
            }

            let id_user = request.params.id_user;
            let resultValidation = validateUser(request.body);

            if (resultValidation.status === false) {
                return response.json({
                    status: false,
                    message: resultValidation.message
                });
            }

            const existingUser = await UserModel.findOne({
                where: { id_user: id_user }
            });

            if (!existingUser) {
                return response.json({
                    status: false,
                    message: 'User tidak ditemukan'
                });
            }

            // Enkripsi password baru menggunakan MD5
            let newPassword = request.body.password;
            if (newPassword) {
                newPassword = md5(newPassword);
            }

            // Simpan gambar jika ada file yang diunggah
            let gambarFilename = existingUser.gambar; // Inisialisasi dengan gambar yang sudah ada
            if (request.file) {
                // Hapus file lama jika ada
                if (existingUser.gambar) {
                    let oldFilePath = path.join(__dirname, `./user-image`, existingUser.gambar);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
                // Simpan file baru
                gambarFilename = request.file.filename;
            }

            const newData = {
                nama_user: request.body.nama_user,
                role: request.body.role,
                username: request.body.username,
                password: newPassword || existingUser.password,
                gambar: gambarFilename,
            };

            // Update data user menggunakan model
            await UserModel.update(
                newData,
                { where: { id_user: id_user } }
            );

            return response.json({
                status: true,
                message: 'Data user telah diperbarui'
            });
        });
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        });
    }
};

exports.deleteUser = async (request, response) => {
    try {
        const id_user = request.params.id_user;
        const { password_masuk_hapus } = request.body;

        // Ambil data pengguna berdasarkan id_user
        const existingUser = await UserModel.findOne({
            where: { id_user: id_user }
        });

        if (!existingUser) {
            return response.json({
                status: false,
                message: 'User tidak ditemukan'
            });
        }

        if (md5(request.body.password_masuk_hapus) !== existingUser.password) {
            return response.json({
                status: false,
                message: 'Password salah. Tidak dapat Menghapus Data User.'
            });
        }

        // Jika password benar, lanjutkan dengan penghapusan data user
        await UserModel.destroy({
            where: { id_user: id_user }
        });

        return response.json({
            status: true,
            message: 'Data user telah dihapus'
        });
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        });
    }
};