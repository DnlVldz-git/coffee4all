'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('usuarios', [{
      nombre: 'John',
      apellido_pat: 'Doe',
      email: 'ejemplo@gmail.com',
      pwd: "D37C5E7961D0ED500ECF0475346027CF2D7010B7083C411F953936B0E38B1AB2",
      rol: "Admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
