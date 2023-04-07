const register = require("../registerSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const saltRounds = 10
const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        email: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        password: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),
});

// =================Register Api=============
module.exports.registered = (async (req, res) => {
    try {
        const { name,
            email,
            password,
            confirmPassword,
            mobnumber } = req.body;
       const {error,value}=schema.validate(req.body,{
        abortEarly:false
       });
       if(error){
        console.log(error)
        return res.send({error:error})
       }
        const regStudent = await bcrypt.hash(password, saltRounds)
        let registerToInsert = {
            name,
            email,
            password: regStudent,
            confirmPassword,
            mobnumber
        }
        console.log(regStudent)
        const registered = await register.create(registerToInsert)
        console.log(registered)
        res.send({ status: "ok", msg: "data is created", data: registered });
    } catch (err) {
        res.send({ status: "ERR", msg: 'something went wrong' });
        console.log(err)
    }
}
)

// ==================Login Api===============
const loginSchema = Joi.object({
    email: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        password: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),
})
exports.login = (async (req, res) => {
    const secret = "mysecretkey"
    const {
        password,
        email
    } = req.body
    try {
        const {error,value}=loginSchema.validate(req.body,{
            abortEarly:false
           });
           if(error){
            console.log(error)
            return res.send({error:error})
           }
        let data = await register.findOne({ email })
        if (!data) {
            res.send("user is not found")
        } else {
            bcrypt.compare(password, data.password).then(function (result) {
                const token = jwt.sign({ _id: data._id }, secret);
                console.log(token)
                result ? res.send({
                    msg: "login successfully", data: data, token
                })
                    : res.send({ msg: "can not login" })
            })
        }
    } catch {
        res.send({
            msg: "an error",
            error: error.msg
        })
    }
})




















// const syncToken = jwt.sign({payload: { }}, 'JWT_SECRET');
// console.log(syncToken);
