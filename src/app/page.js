import AiGenerates from "@/components/homepage/AiGenerates";
import DemoDashboard from "@/components/homepage/DemoDashboard";
import Hero from "@/components/homepage/Hero";
import TrustedTech from "@/components/homepage/TrustedTech";


export default function Home() {
  return (
    <>
     <div>
       <Hero></Hero>
        <TrustedTech></TrustedTech>
         <AiGenerates></AiGenerates>
         <DemoDashboard></DemoDashboard>
     </div>
    
    </>
  );
}
