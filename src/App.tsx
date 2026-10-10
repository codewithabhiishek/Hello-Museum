import { Noise, Header, Footer, Spotlight, EasterEgg } from "./components/Chrome";
import { Opening } from "./components/Opening";
import { GreetingWall } from "./components/GreetingWall";
import { Anatomy } from "./components/Anatomy";
import { Numbers } from "./components/Numbers";
import { PhoneBooth } from "./components/PhoneBooth";
import { FieldNotes } from "./components/FieldNotes";
import { Ticket } from "./components/Ticket";

export default function App() {
  return (
    <div className="relative min-h-screen bg-midnight bg-blueprint text-chalk antialiased overflow-x-hidden">
      {/* ambient museum light depth */}
      <div className="glow-orb-museum glow-orb-blue top-1/4 -left-48 h-[550px] w-[550px]" aria-hidden="true" />
      <div className="glow-orb-museum glow-orb-gold top-2/3 -right-48 h-[600px] w-[600px]" aria-hidden="true" />
      <Noise />
      <Spotlight />
      <EasterEgg />
      <Header />
      <main className="relative z-10">
        <Opening />
        <GreetingWall />
        <Anatomy />
        <Numbers />
        <PhoneBooth />
        <FieldNotes />
        <Ticket />
      </main>
      <Footer />
    </div>
  );
}
