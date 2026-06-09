// What is Cloudinary?
// Answer:-
// Cloudinary aik cloud-based media management platform hai. Asan alfaz mai, ye aap ki website ya app ki images aur videos ko online store (save) karne, unka size chota karne, aur users ko bohot fast speed mai dikhane ka kaam karta hai

// Fayda: v2 ka matlab hai ke aap Cloudinary ka latest version (Version 2) use kar rahe hain, jo zyada fast aur secure hai.
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// cloud_name: Ye aap ke Cloudinary account ka unique naam (ID) hai, jahan aap ki images save hoti hain.
// api_key: Ye aap ka username samajh lein, jo Cloudinary ko batata hai ke ye aap ka hi account hai.
// api_secret: Ye aap ka password hai. Is ko hamesha secret rakha jata hai taakay koi aur aap ke account ko access na kare.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export default cloudinary;
