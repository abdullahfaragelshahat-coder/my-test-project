import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";


function Prescriptions() {


const API = "http://127.0.0.1:8000/api/prescriptions";

const token = localStorage.getItem("token");



const emptyForm = {

doctor_id:"",

patient_id:"",

diagnosis:"",

prescription_date:"",

medicines:[
{
id:"",
quantity:"",
dosage:""
}
]

};




const [prescriptions,setPrescriptions] = useState([]);

const [formData,setFormData] = useState(emptyForm);


const [editingId,setEditingId] = useState(null);


const [selectedPrescription,setSelectedPrescription] = useState(null);


const [loading,setLoading] = useState(false);


const [loadingList,setLoadingList] = useState(true);





// =========================
// GET PRESCRIPTIONS
// =========================

const fetchPrescriptions = async()=>{


try{


const res = await axios.get(API,{

headers:{

Authorization:`Bearer ${token}`,

Accept:"application/json"

}

});



const data = Array.isArray(res.data)

?

res.data

:

res.data.data || [];



setPrescriptions(data);



}

catch(error){


console.log(error);


toast.error("Failed loading prescriptions");


}


finally{


setLoadingList(false);


}


};





useEffect(()=>{


fetchPrescriptions();


},[]);







// =========================
// MEDICINES
// =========================


const addMedicine = ()=>{


setFormData({

...formData,

medicines:[

...formData.medicines,

{

id:"",

quantity:"",

dosage:""

}

]

});


};





const removeMedicine=(index)=>{


const meds=[...formData.medicines];


meds.splice(index,1);



setFormData({

...formData,

medicines:meds

});


};





const updateMedicine=(index,key,value)=>{


const meds=[...formData.medicines];


meds[index][key]=value;



setFormData({

...formData,

medicines:meds

});


};







// =========================
// SAVE
// =========================


const handleSubmit=async()=>{


if(

!formData.doctor_id ||

!formData.patient_id ||

!formData.diagnosis ||

!formData.prescription_date

){

toast.error("Fill all fields");

return;

}





const payload={


doctor_id:Number(formData.doctor_id),


patient_id:Number(formData.patient_id),


diagnosis:formData.diagnosis,


prescription_date:formData.prescription_date,



medicines:

formData.medicines.map(m=>({

id:Number(m.id),

quantity:Number(m.quantity),

dosage:m.dosage

}))


};





try{


setLoading(true);



if(editingId){



await axios.put(

`${API}/${editingId}`,

payload,

{

headers:{

Authorization:`Bearer ${token}`,

Accept:"application/json"

}

}

);



toast.success("Updated successfully");



}

else{



await axios.post(

API,

payload,

{

headers:{

Authorization:`Bearer ${token}`,

Accept:"application/json"

}

}

);



toast.success("Added successfully");


}




setFormData(emptyForm);


setEditingId(null);


fetchPrescriptions();



}

catch(error){


console.log(error.response?.data);



if(error.response?.data?.errors){


Object.values(
error.response.data.errors
)

.forEach(e=>toast.error(e[0]));


}

else{


toast.error(
error.response?.data?.message ||
"Error"
);


}



}

finally{


setLoading(false);


}


};
// =========================
// DELETE
// =========================

const handleDelete = async(id)=>{


if(!window.confirm("Delete prescription?"))
return;


try{


await axios.delete(

`${API}/${id}`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);


toast.success("Deleted successfully");


fetchPrescriptions();


}

catch(error){


console.log(error);

toast.error("Delete failed");


}


};





return (

<div className="container mt-5">


<h2 className="mb-4">
📄 Prescriptions Management
</h2>



<button

className="btn btn-success mb-3"

data-bs-toggle="modal"

data-bs-target="#prescriptionModal"

onClick={()=>{

setEditingId(null);

setFormData(emptyForm);

}}

>

+ Add Prescription

</button>





{
loadingList ?

<div className="text-center">

<div className="spinner-border text-primary"/>

</div>


:

<table className="table table-striped shadow">


<thead className="table-dark">

<tr>

<th>ID</th>

<th>Doctor</th>

<th>Patient</th>

<th>Diagnosis</th>

<th>Date</th>

<th>Actions</th>

</tr>

</thead>



<tbody>



{

prescriptions.map(p=>(


<tr key={p.id}>


<td>
{p.id}
</td>



<td>
{
p.doctor?.name ||
p.doctor_id
}
</td>



<td>
{
p.patient?.name ||
p.patient_id
}
</td>



<td>
{p.diagnosis}
</td>



<td>
{p.prescription_date}
</td>




<td>


{/* VIEW */}

<button

className="btn btn-info btn-sm me-2"

data-bs-toggle="modal"

data-bs-target="#viewModal"

onClick={()=>setSelectedPrescription(p)}

>

<FaEye/>

</button>





{/* EDIT */}

<button

className="btn btn-warning btn-sm me-2"

data-bs-toggle="modal"

data-bs-target="#prescriptionModal"

onClick={()=>{


setEditingId(p.id);



setFormData({

doctor_id:p.doctor_id,

patient_id:p.patient_id,

diagnosis:p.diagnosis,

prescription_date:p.prescription_date,


medicines:

p.medicines?.map(m=>({

id:m.id,

quantity:m.pivot?.quantity || "",

dosage:m.pivot?.dosage || ""

}))

||

[{
id:"",
quantity:"",
dosage:""
}]


});

}}


>

<FaEdit/>

</button>





{/* DELETE */}

<button

className="btn btn-danger btn-sm"

onClick={()=>handleDelete(p.id)}

>

<FaTrash/>

</button>



</td>


</tr>


))


}



</tbody>


</table>


}









{/* =========================
VIEW MODAL
========================= */}


<div className="modal fade" id="viewModal">


<div className="modal-dialog">


<div className="modal-content">


<div className="modal-header">

<h5>
Prescription Details
</h5>


<button

className="btn-close"

data-bs-dismiss="modal"

/>


</div>



<div className="modal-body">


{

selectedPrescription &&

<>


<p>
<b>ID:</b> {selectedPrescription.id}
</p>


<p>
<b>Doctor:</b>

{" "}

{
selectedPrescription.doctor?.name ||
selectedPrescription.doctor_id
}

</p>



<p>
<b>Patient:</b>

{" "}

{
selectedPrescription.patient?.name ||
selectedPrescription.patient_id
}

</p>



<p>

<b>Diagnosis:</b>

{" "}

{selectedPrescription.diagnosis}

</p>




<p>

<b>Date:</b>

{" "}

{selectedPrescription.prescription_date}

</p>



<hr/>


<h6>
Medicines
</h6>



{

selectedPrescription.medicines?.length

?


selectedPrescription.medicines.map(m=>(


<div

key={m.id}

className="border p-2 mb-2"

>


💊 <b>{m.name}</b>


<br/>

Quantity:

{m.pivot?.quantity}


<br/>

Dosage:

{m.pivot?.dosage}



</div>


))


:

<p>
No medicines
</p>


}



</>


}


</div>



</div>


</div>


</div>
{/* =========================
ADD / EDIT MODAL
========================= */}


<div

className="modal fade"

id="prescriptionModal"

tabIndex="-1"

>


<div className="modal-dialog">


<div className="modal-content">



<div className="modal-header">


<h5>

{
editingId
?
"Edit Prescription"
:
"Add Prescription"
}

</h5>



<button

className="btn-close"

data-bs-dismiss="modal"

/>


</div>





<div className="modal-body">



<input

className="form-control mb-2"

placeholder="Doctor ID"

value={formData.doctor_id}

onChange={(e)=>

setFormData({

...formData,

doctor_id:e.target.value

})

}

/>





<input

className="form-control mb-2"

placeholder="Patient ID"

value={formData.patient_id}

onChange={(e)=>

setFormData({

...formData,

patient_id:e.target.value

})

}

/>






<textarea

className="form-control mb-2"

placeholder="Diagnosis"

value={formData.diagnosis}

onChange={(e)=>

setFormData({

...formData,

diagnosis:e.target.value

})

}

/>






<input

type="date"

className="form-control mb-3"

value={formData.prescription_date}

onChange={(e)=>

setFormData({

...formData,

prescription_date:e.target.value

})

}

/>







<h5>
Medicines
</h5>





{

formData.medicines.map((m,index)=>(


<div

key={index}

className="border rounded p-2 mb-2"

>


<input

className="form-control mb-2"

placeholder="Medicine ID"

value={m.id}

onChange={(e)=>

updateMedicine(

index,

"id",

e.target.value

)

}

/>





<input

className="form-control mb-2"

placeholder="Quantity"

value={m.quantity}

onChange={(e)=>

updateMedicine(

index,

"quantity",

e.target.value

)

}

/>






<input

className="form-control"

placeholder="Dosage"

value={m.dosage}

onChange={(e)=>

updateMedicine(

index,

"dosage",

e.target.value

)

}

/>






<button

className="btn btn-danger btn-sm mt-2"

onClick={()=>removeMedicine(index)}

>

Remove

</button>



</div>


))


}







<button

className="btn btn-secondary"

onClick={addMedicine}

>

+ Add Medicine

</button>



</div>







<div className="modal-footer">



<button

className="btn btn-primary"

disabled={loading}

onClick={handleSubmit}

>


{

loading

?

"Saving..."

:

"Save"

}


</button>



</div>




</div>


</div>


</div>





</div>

);


}


export default Prescriptions;