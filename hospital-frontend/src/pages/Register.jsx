// File: src/pages/Register.jsx

import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./Login.css";


function Register() {


  const navigate = useNavigate();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [passwordConfirmation,setPasswordConfirmation] = useState("");

  const [loading,setLoading] = useState(false);



  const handleRegister = async(e)=>{


    e.preventDefault();



    if(
      !name.trim() ||
      !email.trim() ||
      !password ||
      !passwordConfirmation
    ){

      toast.error("Please fill all fields");

      return;

    }



    if(password !== passwordConfirmation){

      toast.error("Passwords do not match");

      return;

    }



    setLoading(true);



    try{


      await axios.post(

        "http://127.0.0.1:8000/api/register",

        {

          name,
          email,
          password,
          password_confirmation:
          passwordConfirmation

        }

      );



      toast.success(
        "Account created successfully"
      );


      navigate("/login");



    }catch(error){



      const errors =
      error.response?.data?.errors;



      if(errors){


        Object.values(errors)
        .flat()
        .forEach(err=>
          toast.error(err)
        );


      }else{


        toast.error(
          error.response?.data?.message ||
          "Register Failed"
        );


      }



    }finally{


      setLoading(false);


    }


  };





return (

<div className="med-login-container">



{/* LEFT BRAND SIDE */}

<div className="med-brand-side">


<div className="brand-overlay"></div>



<div className="brand-top">


<div className="logo-icon-wrap">

<HospitalMark/>

</div>


<span className="brand-title">

CuraPulse Medical

</span>


</div>





<div className="brand-center">


<h2>

إنشاء حساب
<br/>

لإدارة المستشفى بذكاء

</h2>



<p>

انضم إلى منصة الرعاية الصحية الحديثة
لإدارة المرضى والأطباء والمواعيد
بسهولة وأمان.

</p>


</div>






<div className="brand-bottom">


<div className="live-indicator">


<span className="pulsing-dot"></span>


<span>

النظام الطبي يعمل بكفاءة

</span>


</div>


</div>


</div>






{/* FORM SIDE */}



<div className="med-form-side">


<div className="med-card">





<div className="mobile-header">


<HospitalMark/>


<span>

CuraPulse Medical

</span>


</div>






<div className="card-heading">


<span className="badge-tag">

تسجيل جديد

</span>



<h2>

إنشاء حساب موظف

</h2>



<p>

أدخل بياناتك للانضمام للنظام

</p>



</div>








<form onSubmit={handleRegister}>


<div className="med-input-group">


<label>

الاسم الكامل

</label>


<input

type="text"

placeholder="Ahmed Mohamed"

value={name}

onChange={
e=>setName(e.target.value)
}

/>


</div>






<div className="med-input-group">


<label>

البريد الإلكتروني

</label>


<input

type="email"

placeholder="name@hospital.com"

value={email}

onChange={
e=>setEmail(e.target.value)
}

/>


</div>







<div className="med-input-group">


<label>

كلمة المرور

</label>


<input

type="password"

placeholder="••••••••"

value={password}

onChange={
e=>setPassword(e.target.value)
}

/>


</div>






<div className="med-input-group">


<label>

تأكيد كلمة المرور

</label>


<input

type="password"

placeholder="••••••••"

value={passwordConfirmation}

onChange={
e=>setPasswordConfirmation(e.target.value)
}

/>


</div>







<button

type="submit"

className="med-submit-btn"

disabled={loading}

>


{

loading

?

"جاري إنشاء الحساب..."

:

"إنشاء الحساب"

}


</button>



</form>








<div className="med-footer-link">


لديك حساب بالفعل؟


<Link to="/login">

تسجيل الدخول

</Link>


</div>






</div>


</div>



</div>


);



}







function HospitalMark(){

return (

<svg
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
width="32"
height="32"
>


<rect

x="3"

y="3"

width="18"

height="18"

rx="5"

fill="#0284c7"

opacity="0.15"

/>



<path

d="M12 7v10M7 12h10"

stroke="#0284c7"

strokeWidth="2.5"

strokeLinecap="round"

/>



</svg>

);


}




export default Register;