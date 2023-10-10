export default class AdminDTO {
    constructor(allUsers) {
        this.allUsers = allUsers.map((user) => {
            return {
                first_name: user.first_name,
                email: user.email,
                rol: user.rol,
                _id: user._id
            };
        });
    };
};
