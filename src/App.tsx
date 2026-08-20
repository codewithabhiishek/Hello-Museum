import { Noise, Header, Footer } from "./components/Chrome";
import { Opening } from "./components/Opening";
import { GreetingWall } from "./components/GreetingWall";
import { Anatomy } from "./components/Anatomy";
import { Numbers } from "./components/Numbers";
import { PhoneBooth } from "./components/PhoneBooth";
import { FieldNotes } from "./components/FieldNotes";
import { Ticket } from "./components/Ticket";

export default function App() {
  return (
    <div className="relative min-h-screen bg-midnight bg-blueprint text-chalk antialiased">
      <Noise />
      <Header />
      <main>
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
