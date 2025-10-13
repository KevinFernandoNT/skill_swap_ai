export const Community = () => {
  const testimonials = [
    {
      text: "Really impressed with SkillSwap AI's Assistant. It has helped me troubleshoot and solve complex learning path issues.",
      author: "@TyronBache"
    },
    {
      text: "I've always used SkillSwap AI just as a learning platform. Yesterday, I helped debug a founder's skill-exchange project built with React + React Router — no backend server. The 'backend' was entirely SkillSwap AI Edge Functions as the API. First time using SkillSwap AI this way. Impressive.",
      author: "@MinimEditor"
    },
    {
      text: "Love SkillSwap AI custom domains makes the auth so much better",
      author: "@orlandopedro_"
    },
    {
      text: "Loving #SkillSwapAI MCP. Claude Code would not only plan what data we should save but also figure out a migration script by checking what the schema looks like on SkillSwap AI via MCP.",
      author: "@sdusteric"
    },
    {
      text: "I love SkillSwap AI's built-in Advisors. The security and performance linters improve everything and boost my confidence in what I'm building!",
      author: "@SteinlageScott"
    },
    {
      text: "Working with SkillSwap AI has been one of the best dev experiences I've had lately. Incredibly easy to set up, great documentation, and so many fewer hoops to jump through than the competition. I definitely plan to use it on any and all future projects.",
      author: "@BowTiedQilin"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Join the community
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover what our community has to say about their SkillSwap AI experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">"{testimonial.text}"</p>
              <div className="text-sm font-semibold text-gray-500">{testimonial.author}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              GitHub discussions
            </a>
            <a 
              href="#" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
