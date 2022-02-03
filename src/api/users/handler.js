const ClientError = require("../../exceptions/ClientError");

class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    }

    async postUserHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload);

            const { username, password, fullname } = request.payload;
            const userId = await this._service.addUser({ username, password, fullname });

            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    userId,
                },
            });
            response.code(201);
            return response;

        }
        catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server Error
            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async getUserByIdHandler(request, h) {
        try {
            const { id } = request.params;

            const user = await this._service.getUserById(id);

            return {
                status: 'success',
                data: {
                    user,
                },
            };
        }
        catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //Server Error
            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }
}

module.exports = UsersHandler;