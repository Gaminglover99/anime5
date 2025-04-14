import Layout from "@/components/layout/layout";

const CookiesPolicyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Cookies Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: April 8, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How Anime Kingdom Uses Cookies</h2>
              <p className="mb-4">
                When you use and access the Service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Essential cookies</strong>: We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.
                </li>
                <li>
                  <strong className="text-white">Functionality cookies</strong>: We may use functionality cookies to remember information that changes the way the Service behaves or looks, such as the "remember me" functionality or a user's language preference.
                </li>
                <li>
                  <strong className="text-white">Account-related cookies</strong>: We may use account-related cookies to authenticate users and prevent fraudulent use of user accounts. We may use these cookies to remember information that changes the way the Service behaves or looks, such as the "remember me" functionality.
                </li>
                <li>
                  <strong className="text-white">Analytics cookies</strong>: We may use analytics cookies to track information about how the Service is used so that we can make improvements. We may also use analytics cookies to test new features and to make changes to the functionality and content of the Service.
                </li>
                <li>
                  <strong className="text-white">Preferences cookies</strong>: These cookies allow our Service to remember choices you have made in the past, like what video quality you prefer or what your language preference is.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Third-Party Cookies</h2>
              <p className="mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and enhance the user experience.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Social media cookies</strong>: These cookies allow you to share content from our Service directly on social media platforms and may collect information about your social media usage.
                </li>
                <li>
                  <strong className="text-white">Advertising cookies</strong>: These cookies collect information about your browsing habits to make advertising relevant to you and your interests.
                </li>
                <li>
                  <strong className="text-white">Security cookies</strong>: We use these cookies to help identify and prevent potential security risks.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. What Specific Cookies We Use</h2>
              <p className="mb-4">
                Here is a detailed list of the cookies we use on our Service:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-white">Cookie Name</th>
                      <th className="px-4 py-3 text-left text-white">Type</th>
                      <th className="px-4 py-3 text-left text-white">Purpose</th>
                      <th className="px-4 py-3 text-left text-white">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    <tr>
                      <td className="px-4 py-3">session</td>
                      <td className="px-4 py-3">Essential</td>
                      <td className="px-4 py-3">Used to maintain your session state and authentication</td>
                      <td className="px-4 py-3">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">remember_me</td>
                      <td className="px-4 py-3">Functionality</td>
                      <td className="px-4 py-3">Used to remember your login information</td>
                      <td className="px-4 py-3">30 days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">language</td>
                      <td className="px-4 py-3">Preferences</td>
                      <td className="px-4 py-3">Stores your language preference</td>
                      <td className="px-4 py-3">1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">video_quality</td>
                      <td className="px-4 py-3">Preferences</td>
                      <td className="px-4 py-3">Remembers your preferred video quality setting</td>
                      <td className="px-4 py-3">1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">_ga, _gid, _gat</td>
                      <td className="px-4 py-3">Analytics</td>
                      <td className="px-4 py-3">Google Analytics cookies used to distinguish users and throttle request rate</td>
                      <td className="px-4 py-3">Varies (2 years, 24 hours, 1 minute)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. How to Control Cookies</h2>
              <p className="mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site, and some services and functionalities may not work.
              </p>
              <p className="mb-4">
                Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can however obtain up-to-date information about blocking and deleting cookies via these links:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#ff3a3a] hover:underline">Chrome</a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-[#ff3a3a] hover:underline">Firefox</a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-[#ff3a3a] hover:underline">Microsoft Edge</a>
                </li>
                <li>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#ff3a3a] hover:underline">Safari</a>
                </li>
                <li>
                  <a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank" rel="noopener noreferrer" className="text-[#ff3a3a] hover:underline">Opera</a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to This Cookies Policy</h2>
              <p className="mb-4">
                We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new Cookies Policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
              <p>
                You are advised to review this Cookies Policy periodically for any changes. Changes to this Cookies Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our Cookies Policy, please contact us:
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

export default CookiesPolicyPage;