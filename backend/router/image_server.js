const express = require("express")
const cors = require('cors')
const app = express()

const multer = require('multer')
const router = require("./routs")


//multer 미들웨어 파일 제한값 
const limits = {
	filedNameSize : 200, //필드명 사이즈 최대값 
	filedSize : 1024 * 1024, //필드 사이즈 값 설정
	filelds : 2, // 파일 형식이 아닌 필드의 최대 개수 
	fileSize: 16777216, //최대 파일 사이즈 
	files : 10 //파일 필드 최대 개수 
}

/**
 * @author Hwan 
 * @description 파일 업로드시 파일 체크 함수 
 */
const fileFilter = (req, file, callback) => {
	const typeArray = file.minetype.split('/');
	const fileType = typeArray[1]; //확장자 추출

	if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png') {
		callback(null, true)
	} else {
		return callback({message: "*.jpg, *.jpeg, *.png 파일만 가능합니다"}, false)
	}
}

//업로드 파일 지정 
const upload = multer({
	dest: __dirname+'/uploads/',
	limits: limits, 
	fileFilter: fileFilter
})

/**
 * @author Hwan 
 * @description 단일 및 여러 파일 업로드 
 */
const fileFields = upload.fields([
	{name: 'file1', maxCount: 1},
	{name: 'file2', maxCount: 8},
]);

app.post('/upload', fileFields, (req, res, next) => {
	const { file1, file2 } = req.files;
	const { name } = req.body;

	console.log("body data : ", name);

	//배열 형태이므로 반복문을 통해 파일 정보 추출
	file1.map(data => {
		console.log("file1");
		console.log("	");
		console.log("field name: ", data.filedname);
		console.log("upload file name: ", data.originalname);
		console.log("file encoding type: ", data.encoding);
		console.log("file Mime type: ", data.mimetype);
		console.log("save file name: ", data.filedname);
		console.log("upload path: ", data.path);
		console.log("file byte size: ", data.size);
	})
	console.log("	");
	console.log("--------------------------");
	console.log("	");

	file2.map(data => {
		console.log("file1");
		console.log("	");
		console.log("field name: ", data.filedname);
		console.log("upload file name: ", data.originalname);
		console.log("file encoding type: ", data.encoding);
		console.log("file Mime type: ", data.mimetype);
		console.log("save file name: ", data.filedname);
		console.log("upload path: ", data.path);
		console.log("file byte size: ", data.size);
	})

	res.json({ok: true, data: "Fields Upload OK"});

})

//Error Handler
app.use((err, req, res, next) => {
	res.json({ok: false, data: err.message})
})

app.use(cors())

module.exports = router;