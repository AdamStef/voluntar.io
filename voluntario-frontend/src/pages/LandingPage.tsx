import { Navbar } from '@/components/ui/Navbar.tsx';

export const LandingPage = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <div className="text-black">
          <div className="max-w-[800px] mx-auto px-4">
            <div className="hidden md:flex md:flex-row md:items-start mt-8">
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2 md:mb-0 md:mr-8 mt-36 font-bold">
                Wspomóż swoją<br/>lokalną społeczność!
              </div>
              <img className="max-w-full h-auto md:w-1/2" src="src/assets/lp_teens_with_heart.png" alt="Helping Teens" />
            </div>
            {}
            <div className="md:hidden flex flex-col justify-center items-center mt-8">
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2 mt-8 font-bold">
                Wspomóż swoją<br/>lokalną społeczność!
              </div>
              <img className="max-w-full h-auto" src="src/assets/lp_teens_with_heart.png" alt="Helping Teens" />
            </div>
            {}
            <div className="hidden md:flex md:flex-row md:items-center mt-8">
              <img className="max-w-full h-auto md:w-1/2 md:ml-8 md:mt-0" src="src/assets/lp_helping_hands.png" alt="Helping Hands" />
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl mt-8 md:mt-0 md:text-right md:ml-8 font-bold">
                <span>Zarejestruj się </span>
                <span className="text-[#1BA429]">teraz!</span>
              </div>
            </div>
            {}
            <div className="md:hidden flex flex-col justify-center items-center mt-8">
              <img className="max-w-full h-auto" src="src/assets/lp_helping_hands.png" alt="Helping Hands" />
              <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl mt-2 font-bold">
                <span>Zarejestruj się </span>
                <span className="text-[#1BA429]">teraz!</span>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="max-w-[800px] mx-auto mt-32 px-4 sm:px-6 lg:px-8">
          <h1 className="scroll-m-20 border-b pb-2 text-lg sm:text-2xl font-semibold tracking-tight first:mt-0">
            Czym dokładnie jest <span className="text-[#1BA429]">Voluntar.io?</span>
          </h1>
          <div className="text-black mt-4 text-xs sm:text-base">
            Projekt <span className='text-[#1BA429]'>Voluntar.io</span> to innowacyjny projekt studentów Politechniki Łódzkiej. Formą tego przedsięwzięcia jest prosta aplikacja webowa ułatwiająca obsługę wolontariatu organizacjom, a dla wolontariuszy ułatwiającą pomoc i branie udziału w takich wydarzeniach.  <br/> <br/> Funkcjonalności główne naszej aplikacji:
          </div>

          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>Zapis online na wolontariat</li>
            <li>Sprawdzenie dostępnych wolontariatów</li>
            <li>Kontakt w ramach wolontariatu poprzez posty</li>
          </ul>
        </div>
      </main>
    </>
  );
};
