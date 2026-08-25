export const faqItems = [
  {
    q: "Is this the real RTI Online portal?",
    a: "No — this is a concept redesign built for the Build What Moves India hackathon, not the government's own site. Every step past the drafted request runs as a simulation: no application is actually filed, no identity is actually verified, and no payment is actually taken.",
  },
  {
    q: "Do I need an account to file a request?",
    a: "No. Like the real RTI Online portal, you don't need to register or log in — describe your problem and go. The one-time identity check during filing is the only verification step, and it's what your case gets filed under.",
  },
  {
    q: "The assistant said “Answered by local matcher” instead of OpenAI — why?",
    a: "The assistant calls a real OpenAI model when an API key is configured. Without one, it falls back to a keyword matcher instead, so the flow still works end to end. Either way, the reply is labeled with which one actually answered.",
  },
  {
    q: "How much does filing cost?",
    a: "₹10 for most applicants, matching the actual RTI Rules, 2012 fee — waived if you're below the poverty line with a valid BPL certificate. The payment step itself is a simulation; no real transaction happens.",
  },
  {
    q: "Why does my request sometimes show as split across multiple offices?",
    a: "A Nodal Officer forwarding one request to several departments internally is a real part of how RTI requests get handled. The difference is what you see: My RTI collapses that fragmentation back into one case with one plain-language status, instead of a pile of registration numbers to track separately.",
  },
  {
    q: "What happens if my case needs an additional payment?",
    a: "Sometimes a CPIO needs a further fee to cover photocopying or a large volume of documents. My RTI flags this clearly as “Payment needed,” rather than leaving it buried in a status report you'd have to go looking for.",
  },
  {
    q: "Can I file for a state government office through this?",
    a: "No. This covers Ministries, Departments, and Public Authorities of the Central Government only — the same scope the real RTI Online portal has. State-level bodies, including the Government of NCT Delhi, run their own separate RTI processes.",
  },
  {
    q: "How do I appeal if I'm not satisfied with a reply?",
    a: "Under the RTI Act, you can file a First Appeal to that department's Appellate Authority with no additional fee. That flow isn't built in this prototype yet — the case tracker in My RTI covers filing and tracking, not appealing.",
  },
  {
    q: "Is my data actually stored anywhere?",
    a: "Yes — filing a request saves a real case, so you can look it up again later in My RTI or View History under the email you filed with. What's not real: no login, no identity verification, and everything in the shared example set is illustrative data, not an actual government record.",
  },
];
