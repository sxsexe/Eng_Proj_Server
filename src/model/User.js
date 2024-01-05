export class User {

    name;
    sId;
    avatar;
    type;
    create_time;
    update_time;

    auths = []

    static createUserObj({ identityType, credential, identifier }) {
        user = new User();
        // user.auths.add


    }

}