const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

    module.exports = (sequelize) => {
        const User = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [8, 100],
                },
            },
        }, {
            hooks: {
                beforeCreate: async (user) => {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                },
            },
        });

        User.prototype.validPassword = async function (password) {
            return await bcrypt.compare(password, this.password);
        };

        return User;
    };