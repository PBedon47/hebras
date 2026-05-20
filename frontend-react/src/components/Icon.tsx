import {
  FaUser,
  FaLock,
  FaArrowRight,
  FaCheck,
  FaLeaf,
  FaRobot,
  FaPaperPlane
} from "react-icons/fa";

type Props = {
  name:string;
  size?:number;
  color?:string;
};

export default function Icon({
  name,
  size=16,
  color="#000"
}:Props){

  const icons:any = {
    user:<FaUser size={size} color={color}/>,
    lock:<FaLock size={size} color={color}/>,
    arrowRight:<FaArrowRight size={size} color={color}/>,
    check:<FaCheck size={size} color={color}/>,
    leaf:<FaLeaf size={size} color={color}/>,
    robot:<FaRobot size={size} color={color}/>,
    send:<FaPaperPlane size={size} color={color}/>
  };

  return icons[name] || null;
}