export default function HeroHeader() {
  return (
    <div className="w-screen relative mx-auto py-20 md:py-40 px-4 left-0 top-0 flex align-center items-start flex-col">
      {/* Large screen title */}
      <h1 className="animate-title hidden sm:block max-w-[80%] text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-extrabold text-primary-dark pl-8 text-left">
        ENSIA Business <br /> & Entrepreneurship Club
      </h1>

      {/* Small screen title */}
      <h1 className="animate-title block sm:hidden max-w-[80%] text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-extrabold text-primary-dark pl-8 text-left">
        ENSIA <br />
        Business <br />
        & Entrepreneurship <br />
        Club
      </h1>

      <p className="animate-paragraph text-left w-full text-wrap max-w-2xl text-sm md:text-md lg:text-xl mt-8 text-primary-light pl-8">
        We build beautiful products with the latest technologies and frameworks.
        We are a team of passionate developers and designers that love to build
        amazing products.
      </p>
    </div>
  );
}
