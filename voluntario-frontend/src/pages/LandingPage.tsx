export const LandingPage = () => {
  return (
    <div className="container mt-4 flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <h1 className="text-2xl font-bold md:text-4xl">
          Wspomóż swoją
          <br />
          lokalną społeczność!
        </h1>
        <img
          className="w-64 xl:w-96"
          src="src/assets/lp_teens_with_heart.png"
          alt="Helping Teens"
        />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <img
          className="w-64 xl:w-96"
          src="src/assets/lp_helping_hands.png"
          alt="Helping Hands"
        />
        <p className="text-center text-2xl font-bold md:text-4xl">
          Zarejestruj się <span className="text-primary">teraz!</span>
        </p>
      </div>

      <div className="my-16 flex max-w-sm flex-col gap-4 sm:max-w-md md:max-w-xl">
        <h1 className="border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 md:text-3xl">
          Czym dokładnie jest <span className="text-primary">Voluntar.io?</span>
        </h1>
        <p className="text-justify text-base">
          Projekt <span className="text-primary">Voluntar.io</span> to
          innowacyjny projekt studentów Politechniki Łódzkiej. Formą tego
          przedsięwzięcia jest prosta aplikacja webowa ułatwiająca obsługę
          wolontariatu organizacjom, a dla wolontariuszy ułatwiającą pomoc i
          branie udziału w takich wydarzeniach.
        </p>

        <div>
          <h4 className="text-lg font-semibold">
            Główne funkcjonalności naszej aplikacji:
          </h4>

          <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
            <li>Zapis online na wolontariat</li>
            <li>Sprawdzenie dostępnych wolontariatów</li>
            <li>Kontakt w ramach wolontariatu poprzez posty</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
