import { redirect } from "@/lib/navigation";

export default function IndexPage() {
  redirect("/seoul");
  // TODO do this later
  // return (
  //   <div>
  //     <h2>Choose a city</h2>
  //     <select className="text-black">
  //       <option>Seoul</option>
  //       <option>Busan</option>
  //     </select>
  //   </div>
  // );
}
