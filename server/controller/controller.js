const UploadModel = require('../model/schema');
const fs = require('fs');
var ExifImage = require('exif').ExifImage;

exports.home = async (req,res) => {
    const all_images = await UploadModel.find();
    res.render('main', {'images': all_images});
}

exports.uploads = (req, res, next) => {
    const files = req.files;

    if(!files){
        const error = new Error("Please Choose Files");
        error.httpStatusCode = 400;
        return next(error);
    }

    //convet image into base 64 encoding 
    let imgArray = files.map((file)=>{
       let img = fs.readFileSync(file.path);
       let exif;
       try {
        new ExifImage({ image : img }, function (error, exifData) {
            if (error)
                console.log('Error: '+error.message);   
            else{
               
               //console.log(exifData); // Do something with your data!
               // exif =  JSON.stringify(exifData, null, 4);
               // exif = "test";
               res.json(exifData);
                console.log(exifData);                
            }

        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
    return {name: file.path, exif:exif}; 
   
       //encode_image = img.toString('base64')
    });

   // res.json(imgArray);

    
//    let result = imgArray.map((src, index) => {
//         //create object to store data in the collection 
//         let finalImage = {
//             filename : files[index].originalname,
//             contentType: files[index].mimetype,
//             imageBase64: src
//         }
//         let newUpload = new UploadModel(finalImage);
//         return newUpload.save().then(()=>{
//             return {msg : `${files[index].originalname} Uploaded successfully...!`}
//         }).catch(error =>{
//             if(error){
//                 if(error.name == 'MongoError' && error.code == 11000){
//                     return Promise.reject({error : `Duplicate ${files[index].originalname} File Already Exists `})
//                 }
//                 return Promise.reject({error: error.message || `Cannot Upload`})
//             }
//         });
//     })
    


//  Promise.all(result).then(msg=> {
//     //res.json(msg);
//      res.redirect('/'); 
//     }).catch(err => {
//         res.json(err);
//     });
}