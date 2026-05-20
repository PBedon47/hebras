type Props = {
  label:string;
  color:string;
  size?:number;
};

export default function Avatar({
  label,
  color,
  size=40
}:Props){

  return(
    <div
      style={{
        width:size,
        height:size,
        borderRadius:"50%",
        background:color,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        color:"#fff",
        fontWeight:700
      }}
    >
      {label}
    </div>
  );
}