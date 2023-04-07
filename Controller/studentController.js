const student = require("../data")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const Joi = require('joi');

//==========DeleteStudents API===========
exports.deleteStudents = (
    async (req, res) => {
        let { apid } = req.params
        // console.log(apid)
        try {
            let datas = await data.findByIdAndDelete({ _id: apid })
            res.send({ status: "OK", msg: "Data deleted succsessfuly", data: datas })
        }
        catch (err) {
            res.send({ staus: "ERR", msg: "Something went wrong while deletation", data: null })
        }
    })
//==============EditStudent Api==============
exports.editStudent = (
    async (req, res) => {
        const { name, email } = req.body
        let { apid } = req.params
        try {
            let datas = await data.findByIdAndUpdate(apid, { $set: { name, email } })
            res.send({ status: "OK", msg: "Data updated successfuly", data: datas })
        }
        catch (err) {
            res.send({ status: "ERR", msg: "Something went wrong while updation." })
        }
    })
//===================AddEnquiry Api===========
const data = require("../data")
const addSchema = Joi.object({
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

        mobileNumber: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        whatsappNumber: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        gender: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        dob: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        workingExp: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        company: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),

        address: Joi.string()
        // .alphanum()
        .min(3)
        .max(30)
        .required(),
})
exports.addEnquiry = ((req, res) => {
    const secret = 'mysecretkey';
    try {
        const {error,value}=addSchema.validate(req.body,{
            abortEarly:false
           });
           if(error){
            console.log(error)
            return res.send({error:error})
           }
        const { name, email, mobileNumber, whatsappNumber, gender, dob, workingExp, company, address, fees, course, createdBy } = req.body
        data.create({ name, email, mobileNumber, whatsappNumber, gender, dob, workingExp, company, address, fees, course, createdBy })
        res.send({ msg: "Data created", data: data })
            
    }
    catch (err) {
        res.send("Data not created")
        console.log(err)
    }

})

//================GetStudent Api==============
exports.getStudents = (async (req, res) => {
    let { query, page, limit, sortBy, sortType } = req.body;
    page = page ? page : 1;
    limit = limit ? limit : 1;
    sortBy = sortBy ? sortBy : "name";
    sortType = sortType ? sortType : "ASC";

    try {
        const params = ["name",
            "mobileNumber",
            "whatsappNumber",
            "email",
            "dob",
            "workingExp",
            "address",
            "company",
            "course",
            "fees"]
        // console.log(query)
        let searchNameQuery = []
        for (let each in params) {
            let key = params[each]
            let value = { $regex: `.*${query}.*`, $options: "i" }
            searchNameQuery.push({ [key]: value })
        }
        let datas = await data.aggregate([
            { $match: { $or: searchNameQuery } },
            { $sort: { [sortBy]: sortType === "ASC" ? 1 : -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);
        let count = await data.aggregate([
            { $match: {} },
            { $count: "totalCount" }
        ]);
        res.send({ staus: "ok", msg: "data posted successfully", data: { datas, count } })
    } catch (err) {
        res.send({ status: "ERR", msg: 'something went wrong', })
        console.log(err)
    }
});

//===============SingleStudent Api===========
exports.singleStudent = (async (req, res) => {
        let { apid } = req.params
        console.log(apid)
        try {
            let datas = await data.findById(apid)
            res.send({ status: "ok", msg: "Data Posted Successfully", data: datas })
            console.log(datas)
        } catch (error) {
            res.send({ status: "ERR", msg: "Error while fetching student data", })
            console.log(error)
        }
    });


    