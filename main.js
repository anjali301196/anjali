const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const data = require("./data")
const cors = require("cors")
const Enqueries = require("./enquiry")
const followUp = require("./addFollowup")
const { query } = require("express")
const courseData = require("./courseModel")
const studentController = require("./Controller/studentController")
// const loginController = require("./Controller/loginController")
const loginController = require("./Controller/loginController")
// const register = require("./registerSchema")
const jwt = require("jsonwebtoken")
const multer = require('multer')
// const upload = multer({ dest: 'document/' })
const app = express()
const profileSchema = require("./profileSchema")
app.use(cors())
const path=require("path")
const Joi = require('joi');
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/document", express.static("document"))
// parse application/json
app.use(bodyParser.json())
 

const URL = `mongodb+srv://anjali:anjali123@cluster0.ckvqo4m.mongodb.net/datas?retryWrites=true&w=majority`
mongoose.connect(URL).then(() => {
    console.log("connected successfully")
}).catch((err) => {
    console.log("not connected")
})

// ====================token verify========================//
const verifyToken = (async (req, res, next) => {
    try {
        const token = await req.headers.authentication
        console.log(token)
        if (token === null) {
            console.log("====nop token provided====")
        } else {
            let decode = jwt.verify(token, 'mysecretkey')
            req.register = decode;
            console.log(decode)
            next()
        }
    } catch (err) {
        res.send({ status: '=====ERR=====', msg: '====token is invalid====' })
    }
}
)

// ===================Multer===================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './document')
    },
    filename: function (req, file, cb) {

        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})
const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
// const fileTypes=/jpg||jpeg/;
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};

// const ValidationMiddleware=(req,res,next)=>{
//     const schema = Joi.object().keys({
// name:Joi.string().alphanum().min(3).max(15).required(),
// email:Joi.string().alphanum().min(3).max(15).required(),
// password:Joi.string().alphanum().min(3).max(15).required(),

//     })
//     const{error}=schema.validate(req.body,{abortEarly:false});
//     if(error){
//         res.status(200).json({error:error})
//     }else{
//         next();
//     }
// }


// Schema.validate({});

const fileSchema = Joi.object({
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required()
    }).required()
});

app.post('/profile', upload.single('image'), async (req, res, next) => {

    // const {error,value}=fileSchema.validate(req.file,{
    //     abortEarly:false
    //    });
    //    if(error){
    //     console.log(error)
    //     return res.send({error:error})
    //    }


    try {
        const name = req.file.path
        console.log(name)
        const file = req.file
        const profiles = await profileSchema.create({ name })
        res.send({ status: "ok", msg: "file uploaded successfully", data: { profiles, file } })
    }
    catch {
        res.send({ status: "error", msg: "something went wrong in upload file", data: null })
    }

    // 
})
// req.file is the `avatar` file
// req.body will hold the text fields, if there were any

// ===========register/login=====================
app.post("/register", loginController.registered)
app.post("/login", loginController.login)

//============get/post===============
app.get('/student', verifyToken, async (req, res) => {
    try {
        const datas = await data.find({})
        res.send({ status: "OK", msg: "data fetched successfully", data: datas })
    } catch (err) {
        res.send({ status: "ERR", msg: "something went wrong" })
    }
})

app.post('/student', verifyToken, studentController.addEnquiry)
// app.get("/get-student", async (req, res) => {
//     let datas = await data.find({})
//     res.send(datas)
// })

app.post("/get-student", verifyToken, studentController.getStudents)

//======================COURSE===================COURSE==============
app.post("/course", async (req, res) => {
    const { course } = req.body;
    courseData
    let courseToInsert = { course }
    
    try {
        let course = await courseData.create(courseToInsert)
        res.send({ status: "OK", msg: "course save successfully", data: course })
    } catch (err) {
        res.send({ status: "ERR", msg: 'something went wrong', data });
        console.log(err)
    }
});

//     .create({course})
//     .then((ap)=>{
//         res.send({status:"ok",msg:"data is created",data:course});
//     })
//       .catch((err)=>{
//         res.send({status:"ERR",msg:'something went wrong',data});
//         console.log(err)
//       });
// });

app.get("/course", async (req, res) => {
    try {
        const courses = await courseData.find({})
        res.send({ status: "ok", msg: "data fetched successfully", data: courses })
    } catch (err) {
        res.send({ status: "ERR", msg: "something went wrong" })
    }
})


// ================FILTERDATA================//
// const filterData = () => {
//     const reqBody = {
//         "course": courseData,
//         "fees": fees,
//     }
//     axios.post(`${BASE_URL}/filter`, reqBody).then((res) => {
//         console.log(res.data)
//     SetCourseData(res.data.data)
//     }).catch(err => {
//         console.log('err')
//     })
// }

app.post("/filter", async (req, res) => {
    try {
        const { courseData, minFees, maxFees } = req.body
        const param = ["courseData", "fees"]
        let filterQuery = []
        // for(let each in param){
        //     let filterKey= param[each]
        //     let filterValue={$regex:`.${courseData,fees}*`,$options:'i'}
        //     filterQuery.push({[filterKey]:filterValue})
        // }
        const filterData = await data.aggregate([
            {
                $match:{
                    $and:[
                        {course:{$in:courseData}},
                        {fees:{$gt:minFees,$lt:maxFees}} 
                    ]
                }
            }
        ])
        res.send({ status: "ok", msg: "data filter successfully", data: filterData })
    } catch (e) {
        res.send({ status: "error", msg: "something went wrong" })
        console.log(e)
    }
})

app.get("/find-name/:apid", verifyToken, studentController.singleStudent)

app.put("/find-names/:apid", verifyToken, studentController.editStudent)

app.delete("/find-namess/:apid", verifyToken, studentController.deleteStudents)

//-------------Enquires Added to database------------------
app.get("/followup-by-enquiry/:studentId", async (req, res) => {
    let { studentId } = req.params
    const {
        enqueries_id,
        is_communicated,
        summary,
        next_follow_enqueries,
        next_follow_enqueries_date_time
    } = req.body
    let enquerieToInserted = {
        enqueries_id,
        is_communicated,
        summary,
        next_follow_enqueries,
        next_follow_enqueries_date_time
    }
    try {
        await Enqueries.create(enquerieToInserted)
        res.send({ status: "OK", msg: "Data Posted Successfully", data: null });
    } catch (err) {
        res.send({ status: "ERR", msg: "Something went wrong" })
    }
})

//===============Add followup================

app.post("/add-followup", async (req, res) => {
    let { studentId } = req.params
    console.log(studentId)
    const {
        enqueries_id,
        is_communicated,
        summary,
        next_follow_enqueries,
        next_follow_enqueries_date_time
    } = req.body
    let addFollowupToInsert = {
        enqueries_id,
        is_communicated,
        summary,
        next_follow_enqueries,
        next_follow_enqueries_date_time
    }
    try {
        await followUp.create(addFollowupToInsert)
        res.send({ status: "OK", msg: "Data Save successfully", data: null })
    }
    catch (err) {
        res.send({ status: "ERR", msg: "SOMETHING WENT WRONG" })
        console.log(err)
    }
})

//==================LOOKUP====================//

app.post("/search", async (req, res) => {
    try {
        const { query, page, limit, sortBy, sortType } = rea.body
        const params = ["name",
            "email",
            "mobileNumber",
            "whatsaap",
            "gender",
            "dob",
            "address",
            "workingExperience",
            "company"
        ]
        console.log(query)
        let searchQuerry = []
        for (let each in params) {
            let key = params[each]
            let value = { $regex: `.*${query}.*`, $options: 'i' }

            searchQuerry.push({ [key]: value })
        }
        let data = await DataSpaceConverter.aggregate([
            { $match: { $or: searchQuerry } },
        ])
        res.send({ status: "OK", msg: "data get successfully", data: data })
    }
    catch (err) {
        res.send({ status: "error", msg: "something went wrong" })
    }
})

//====================DIR NAME// FILE NAME====================================
// console.log(__dirname) 
// absolute path mai jaate hai c\user\desktop\form\anjali(c\user\hp this side slash is use in windows)

// console.log(__filename)
// exact directory mai jaate hai like c\user\desktop\form\anjali\main.js


// // student enquire
// app.post("/studentEnquiry/:studentId", async(req,res)=>{
//     let{studentId}= req.params
//     console.log(studentId)
//     const{
//         studentname,
//         studentnumber,
//          coursename,
//          feedback
//     } = req.body

//     let studentEnquerie={
//         studentname,
//         studentnumber,
//          coursename,
//          feedback
//     }
//     try{
//         await followUp.create(addFollowupToInsert)
//         res.send({status: "OK" ,msg: "Data Save successfully",data:null})
//     }
//     catch(err){
//         res.send({status:"ERR",msg:"SOMETHING WENT WRONG"})
//         console.log(err)
//     }
// })

// app.post('/get-student', async (req, res) => {

//       try {
//         const { query, page, limit, sortBy, sortType } = req.body

//     const params=["name","mobileNumber","whatsappNumber","email","dob","workingExp","address","company"]
//     console.log(query)
//     let serachQuery=[]
//     for(let each in params){
//         let key = params[each]
//         let value = {$regex: `.*${query}.*` ,$options:'i'}
//         serachQuery.push({[key]:value}) 
//     }
//     console.log(serachQuery)

//         // const page = req.query.page?parseInt(req.query.page) :1
//         // const limit=parseInt(req.query.limit)
//         // const skip=(page-1)*limit
//         // const total=await student.countDocument()

//         let datas = await data.aggregate([
//             { $match:  { $or:serachQuery }},
//             //  {$limit:2},
//             // {$sort:{[sortBy]:sortType === 'ASC'?1:-1}},
//             //  {$skip:(page-1)*limit},
//             //  {$limit:limit},
//             //  {$lookup:()}

//         ])
//         res.send({ staus: "OK", msg: "student data fetch successfully", data: datas })
//     } catch (err) {
//         res.send({ status: "err", msg: "something went wrong", data: null })
//     }
// })

app.listen(2569, () => {
    console.log("server is running")
})



































// useEffect(()=>{
//     getdata()
//     fetchCourseData()
//     filterData()
// },[page,limit,sortBy,sortType,search])



//const { default: axios } = require("axios")