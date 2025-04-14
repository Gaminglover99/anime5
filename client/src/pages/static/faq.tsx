import Layout from "../../components/layout/layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

const FAQPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="item-1" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                What is Anime Kingdom?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Anime Kingdom is a platform dedicated to anime enthusiasts, offering a wide range of anime series and movies to watch online for free. Our goal is to provide a seamless streaming experience for anime fans around the world.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                Is Anime Kingdom free to use?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, Anime Kingdom is completely free to use. We believe in making anime accessible to everyone, which is why we don't charge any subscription fees. However, creating an account gives you access to additional features like watchlists and favorites.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                How often do you add new anime?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We strive to update our library regularly with new releases and popular titles. Typically, new episodes of ongoing series are added within 24 hours of their original broadcast, while new movies and complete series are added as soon as they become available with good quality.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                Can I request an anime that's not on your platform?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Absolutely! We welcome anime requests from our users. You can submit requests through the "Request Anime" link in the footer. Our team reviews all requests and tries to add them to our library as soon as possible, depending on availability.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                What video quality do you offer?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                We offer multiple quality options for most anime, typically ranging from 360p to 1080p, depending on the source material. You can select your preferred quality in the video player settings to match your internet connection speed and device capabilities.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                Do you offer both subbed and dubbed versions?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, whenever possible, we provide both subbed (original Japanese audio with subtitles) and dubbed (English or other language voice-overs) versions of anime. You can select your preferred version from the video player options when available.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                Can I download anime episodes for offline viewing?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, we offer download options for most anime on our platform. You can download episodes to watch offline by clicking the download button on the video player page. Different quality options are available for downloads as well.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                Why do I need to create an account?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                While you can watch anime without an account, creating one gives you access to features like watchlists, favorites, viewing history, and personalized recommendations. It also allows you to track your progress through series and receive notifications about new episodes of shows you follow.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                How can I report technical issues or bugs?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                If you encounter any technical issues or bugs while using Anime Kingdom, please use the "Contact" link in the footer to report them. Include detailed information about the problem, such as the device and browser you're using, and steps to reproduce the issue if possible.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                Is Anime Kingdom available on mobile devices?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, Anime Kingdom is fully responsive and works well on smartphones and tablets. You can access all features through your mobile browser without needing to install a separate app. The interface automatically adjusts to provide an optimal viewing experience on smaller screens.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-11" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                How do I join the Anime Kingdom community?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                You can join our community by following us on social media platforms like Instagram and YouTube, or by joining our Discord server. We regularly host discussions, polls, and events where you can interact with fellow anime fans and our team.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-12" className="border-b border-gray-700">
              <AccordionTrigger className="text-xl text-white hover:text-[#ff3a3a]">
                What should I do if an anime won't play?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                If an anime won't play, try the following troubleshooting steps:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Refresh the page</li>
                  <li>Try a different browser</li>
                  <li>Clear your browser's cache and cookies</li>
                  <li>Disable any ad-blockers or VPNs temporarily</li>
                  <li>Try a different video quality setting</li>
                </ul>
                If the problem persists, please contact us with details about the specific anime and episode.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-gray-300 mb-4">
              If you couldn't find the answer to your question, feel free to contact us using the links below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://discord.gg/gXxNnZzsAx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#ff3a3a] text-white rounded hover:bg-red-700 transition-colors"
              >
                Join Our Discord
              </a>
              <button 
                onClick={() => {
                  const contactButton = document.querySelector('[data-contact-dialog-trigger]');
                  if (contactButton instanceof HTMLElement) {
                    contactButton.click();
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;