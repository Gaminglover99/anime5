import Layout from "@/components/layout/layout";

const PrivacyPolicyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: April 8, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to Anime Kingdom. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
              <p>
                This privacy policy applies to all users of our website. Please read it carefully to understand our practices regarding your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. The Data We Collect</h2>
              <p className="mb-4">
                Personal data means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Identity Data</strong> - includes username, password, and any display names you choose to use on our platform.
                </li>
                <li>
                  <strong className="text-white">Contact Data</strong> - includes email address (if provided).
                </li>
                <li>
                  <strong className="text-white">Technical Data</strong> - includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access this website.
                </li>
                <li>
                  <strong className="text-white">Profile Data</strong> - includes your profile picture (if provided), watchlist, favorites, watch history, and settings.
                </li>
                <li>
                  <strong className="text-white">Usage Data</strong> - includes information about how you use our website, such as which anime you watch and for how long.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Collect Your Data</h2>
              <p className="mb-4">
                We use different methods to collect data from and about you including through:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Direct interactions</strong> - You may provide us with your Identity and Contact Data by filling in forms or by corresponding with us by email or otherwise.
                </li>
                <li>
                  <strong className="text-white">Automated technologies or interactions</strong> - As you interact with our website, we automatically collect Technical Data about your equipment, browsing actions and patterns.
                </li>
                <li>
                  <strong className="text-white">Third parties</strong> - We may receive data about you from various third parties such as analytics providers, social media platforms, and content providers.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. How We Use Your Data</h2>
              <p className="mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
                <li>To provide you with the services you've requested, such as maintaining your account, watchlist, and watch history.</li>
                <li>To improve our website and user experience.</li>
                <li>To recommend content that may be of interest to you based on your viewing history and preferences.</li>
                <li>To communicate with you about your account, service updates, or other important information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p className="mb-4">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
              <p>
                We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p className="mb-4">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              <p>
                To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Legal Rights</h2>
              <p className="mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
              <p className="mt-4">
                If you wish to exercise any of these rights, please contact us using the details provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
              <p>
                You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-800 p-4 rounded">
                <p>Email: support@animekingdom.com</p>
                <p>Discord: <a href="https://discord.gg/gXxNnZzsAx" target="_blank" rel="noopener noreferrer" className="text-[#ff3a3a] hover:underline">Join Our Discord Server</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;