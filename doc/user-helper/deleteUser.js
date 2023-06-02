const deleteUser = {
    parameters: [
        {
          name: "id",
          required: true,
          in: "path",
          type: "string",
          description: "User id"
        }
      ],
    post:{
        tags:["Users"],
        responses:{
            200:{
                description:"Ok",
            }
        }
    }
}

export default deleteUser;