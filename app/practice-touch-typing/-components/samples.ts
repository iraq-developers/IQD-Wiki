export interface Sample {
    id: string;
    title: string;
    /** One line, shown on the card — sell the story, don't summarise it. */
    hook: string;
    text: string;
}

/**
 * Things worth typing. Stories that are actually good to read while your
 * fingers do the work, plus a couple of drills for the keys developers dodge.
 */
export const SAMPLES: Sample[] = [
    {
        id: "linus",
        title: "Linus Torvalds",
        hook: "A shy student, a hobby project, and the kernel that ate the world.",
        text: `In 1969, in Helsinki, Finland, a boy named Linus Benedict Torvalds was born into a family of journalists. His grandfather owned one of the first computers in Finland, a Commodore VIC-20, and young Linus was immediately hooked. While other kids played outside, he sat in a small room typing commands into that machine, fascinated by the idea that he could tell a computer what to do and it would obey.
Linus was not a loud kid. He was not the type to raise his hand in class or lead a group project. He was shy, introverted, and mostly kept to himself. But he had something that most people underestimate: a deep and relentless curiosity. He did not just want to use computers. He wanted to understand them from the ground up, every layer, every instruction, every byte.
When he enrolled at the University of Helsinki to study computer science, he discovered Unix, an operating system that was elegant and powerful but expensive and locked behind corporate licenses. Linus wanted something like Unix but free, something he could run on his own cheap PC at home. So at the age of twenty one, in a small apartment in Helsinki, he decided to build his own operating system kernel. Not because anyone asked him to. Not because he had a business plan. Simply because he wanted to learn how it worked.
He posted a humble message on a Usenet group in August 1991. He wrote that he was working on a free operating system, just a hobby, nothing big and professional. He said it would probably never support anything other than his own hardware. That little hobby project became Linux.
What happened next is one of the most remarkable stories in the history of technology. Developers from all over the world started contributing code. They fixed bugs, added features, and ported the kernel to new hardware. Linus did not build Linux alone. He built the seed, and then he built a community. He created a culture of open collaboration where anyone with skill and motivation could contribute, regardless of their degree, their country, or their employer.
Today, Linux runs on more devices than any other operating system in history. It powers almost every Android phone on the planet. It runs the servers behind Google, Amazon, Facebook, and Netflix. It operates the International Space Station. It drives most of the world's supercomputers. The tiny hobby project of a shy Finnish student became the backbone of the modern internet.
But Linus did not stop there. In 2005, he faced another problem. The version control system used by Linux kernel developers was no longer available to them for free. Instead of complaining, Linus spent about ten days building his own tool. He called it Git. That tool is now the most widely used version control system in the world, and it gave rise to platforms like GitHub, which transformed how millions of developers collaborate on code.
There are many lessons in the story of Linus Torvalds, but here are the ones that matter most.
First, you do not need permission to start. Linus did not wait for a company to hire him. He did not wait for a professor to assign the project. He just started building because he was curious. The best projects often begin not with a grand vision but with a simple question: how does this work, and can I build it myself?
Second, small beginnings are not small endings. Linus described Linux as just a hobby. He genuinely did not expect it to become anything significant. But he kept working on it, kept improving it, and kept sharing it. Consistency and openness turned a hobby into a revolution. Never underestimate what you are building today just because it looks small right now.
Third, community multiplies effort. Linus understood early that he could not build everything alone. By making Linux open source, he invited the world to help. The result was something no single company could have built. If you are working on a project, think about how you can involve others. Share your work. Accept contributions. Build in the open.
Fourth, solving your own problems is a valid strategy. Both Linux and Git were born because Linus had a personal itch to scratch. He needed an operating system he could afford. He needed a version control tool that worked the way he wanted. The best tools often come from people who are frustrated enough to build their own solution. If something annoys you in your daily workflow, that frustration might be pointing you toward your next great project.
Fifth, introversion is not a weakness. Linus is famously introverted. He works from home. He communicates mostly through email and mailing lists. He does not give flashy keynote speeches or chase social media fame. Yet he has influenced the world more than most extroverted tech leaders. Your personality is not a limitation. It is a different kind of strength. The world needs people who think deeply, work quietly, and let their output speak for itself.
Sixth, perfection is the enemy of progress. The first version of Linux was rough. It barely worked. It supported almost no hardware. But Linus released it anyway. He knew that getting feedback from real users was more valuable than polishing code in isolation. If you are waiting until your project is perfect before you show it to anyone, you are waiting too long. Ship early. Iterate often. Let the world help you improve.
Seventh, learning never stops. Even after creating one of the most important pieces of software in history, Linus continues to review code, make decisions about the kernel, and learn from contributors around the world. Mastery is not a destination. It is a practice. Every line of code you write, every bug you fix, every new technology you explore adds to your skill and your understanding.
Think about where you are right now. You are sitting at your keyboard, practicing your typing, building a skill that will serve you every single day of your career. Every word you type is training your fingers and your brain to work together faster and more accurately. It might feel tedious sometimes. It might feel like progress is slow. But remember Linus in his small apartment in Helsinki, typing away at something nobody else believed in. He did not know where it would lead. He just kept going.
You are building something too. Maybe it is a SaaS platform. Maybe it is a mobile app. Maybe it is your career, your skills, your future. Whatever it is, the recipe is the same. Start where you are. Use what you have. Do not wait for perfect conditions. Share your work. Learn from feedback. And never, ever stop typing.
The world does not reward the most talented. It rewards the most persistent. Keep your fingers on the home row. Keep your eyes on the screen. And keep building, one keystroke at a time.`,
    },
    {
        id: "jobs",
        title: "Steve Jobs & Apple",
        hook: "$1,300, a garage, a firing, and the most valuable company on earth.",
        text: `In 1976, Steve Jobs was 21 years old, broke, and working out of his parents' garage at 2066 Crist Drive, Los Altos, California. He and Steve Wozniak had $1,300 between them. They sold a VW van and an HP-65 calculator to raise the money. Their plan? Build a computer that ordinary people (not just engineers) could use at home.
The first Apple I sold for $666.66 each. They built 200 units by hand. It was a bare circuit board with no case, no keyboard, and no screen. Buyers had to supply their own. It was not glamorous. It was not polished. But it was a start, and that start changed everything.
By 1980 (just 4 years later), Apple went public at $22 per share. The IPO raised $100 million and created over 300 millionaires overnight. It was the largest IPO since Ford Motor Company in 1956. Jobs was worth $256 million at the age of 25. The kid from the garage was now one of the richest people in America.
But success did not protect him from failure. In 1985, Jobs was fired from his own company. The board of directors sided with CEO John Sculley in a power struggle, and Jobs was out. He was 30 years old. He had lost the company he built from nothing. Most people would have given up. Jobs did not.
He started NeXT Computer in 1985, investing $12 million of his own money. The NeXT workstation sold for $6,500 (about $17,000 in today's money) and was considered too expensive for most buyers. Commercially, it was a flop. But the technology inside it was revolutionary. Tim Berners-Lee used a NeXT computer to build the first web server and web browser in 1990. The foundation of the World Wide Web was literally built on a machine that most people considered a failure.
In 1986, Jobs also bought a small graphics division from Lucasfilm for $5 million. He renamed it Pixar. For the next 9 years, Pixar burned through cash and struggled to find its footing. Jobs poured roughly $50 million into the company before it produced its first feature film. That film was "Toy Story" (1995), and it grossed $373 million worldwide. Pixar went public 1 week after the film's release, and Jobs' 80% stake was suddenly worth $585 million.
Then came the return. In 1997, Apple was 90 days from bankruptcy. They bought NeXT for $429 million, bringing Jobs back as an advisor. Within months, he was interim CEO. His first major move? He called Bill Gates and secured a $150 million investment from Microsoft. The crowd at Macworld booed when Gates' face appeared on screen, but Jobs knew what he needed: survival first, revolution later.
The numbers that followed are staggering. The iMac (1998) sold 800,000 units in its first 5 months. The iPod (2001) eventually captured 70% of the MP3 player market. iTunes sold its 1 billionth song in February 2006. The iPhone (2007) generated $1.5 billion in revenue in its first fiscal quarter alone. The App Store (2008) hit 500 million downloads in its first 100 days.
By 2011, Apple became the most valuable company in the world with a market cap exceeding $337 billion. Jobs had turned a near-bankrupt company into a global powerhouse in just 14 years.
Here is what makes this story matter for you. Jobs did not have a computer science degree. He dropped out of Reed College after just 1 semester because his working-class parents could not afford the $3,200-per-year tuition. But he kept learning. He sat in on classes he found interesting, including a calligraphy course that later influenced the beautiful typography on the Mac.
He was rejected, humiliated, and counted out more than once. He failed publicly with the Apple III (6,000+ units recalled), the Lisa ($9,995 price tag, sold only 10,000 units), and the NeXT Cube. Each failure taught him something. Each setback sharpened his instincts.
The lesson is not that failure is fun. It is not. The lesson is that failure is not final unless you decide it is. Every "no" you hear, every project that flops, every idea that does not land is just data. It tells you what to adjust, what to rethink, and where to push harder.
Jobs once said something that stuck with a lot of people: "You can't connect the dots looking forward; you can only connect them looking backwards." That calligraphy class made no sense at the time. Getting fired from Apple seemed like the worst thing that could happen. Pouring $50 million into an animation studio looked insane. But each of those dots connected later in ways he could never have predicted.
So keep typing. Keep building. Keep failing. The dots will connect.`,
    },
    {
        id: "drill-code",
        title: "Code & Numbers",
        hook: "Brackets, regex, ports and semicolons — the keys everyone avoids.",
        text: `This is not a story. This is a finger drill. Every character here is chosen to train the keys you use most as a developer. Slow down if you need to. Accuracy beats speed. Let's go.
The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly.
Now let's hit the number row. Type these carefully: 1 2 3 4 5 6 7 8 9 0. Again: 10 20 30 40 50 60 70 80 90 100. Mix it up: 15 28 37 46 59 64 73 82 91 100. Bigger numbers: 128 256 512 1024 2048 4096 8192 16384 32768 65536. Common ports: 80 443 3000 3001 5173 5432 8080 8443 27017 6379.
Symbols time. These are the keys most typists avoid, but developers use them constantly.
Brackets: () [] {} <> () [] {} <>. Try pairs: (value) [index] {object} <element>. Nested: ({[]}) [{()}] {[(<>)]}.
Operators: + - * / = != == === !== >= <= && || ! ? : %. More: += -= *= /= ++ -- ** ?? ?. =>. Bitwise: & | ^ ~ << >>.
Strings and quotes: "hello" 'world' \`template\` "it's" 'she said "hi"' \`\${count} items\`. Escape sequences: \\n \\t \\r \\\\ \\' \\" \\0.
Punctuation drill: Hello, World! How are you? Yes/no... maybe@later. Price: $49.99 (30% off). Email: user@example.com. URL: https://api.example.com/v2/users?page=1&limit=25.
Now let's type some real code patterns. These are common things you write every day.
const name = "Omar"; let count = 0; const isActive = true; let items: string[] = [];
function add(a: number, b: number): number { return a + b; }
const users = await db.query("SELECT * FROM users WHERE active = $1", [true]);
if (status === 200 && data.length > 0) { setItems(data); } else { setError("No results found."); }
const result = items.filter((item) => item.price >= 10 && item.price <= 99.99).map((item) => ({ ...item, total: item.price * item.qty })).sort((a, b) => b.total - a.total);
export default function App({ children }: { children: React.ReactNode }) { return <main className="flex min-h-screen flex-col items-center">{children}</main>; }
try { const res = await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: 42, tags: ["a", "b", "c"] }) }); if (!res.ok) throw new Error(\`HTTP \${res.status}\`); const json = await res.json(); console.log("Success:", json); } catch (err) { console.error("Failed:", err); }
CSS values you type often: #ffffff #000000 #3b82f6 rgba(0, 0, 0, 0.5) hsl(220, 90%, 56%). Sizes: 0.5rem 1rem 1.5rem 16px 24px 32px 48px 64px 100vh 100vw.
Common terminal commands: cd ~/projects && ls -la. git add . && git commit -m "fix: resolve auth bug #127". npm run dev --port=3000. docker-compose up -d --build. ssh user@192.168.1.100 -p 22.
Regex patterns (the ultimate finger workout): /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/ matches emails. /^\\+?[1-9]\\d{1,14}$/ matches phone numbers. /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ matches hex colors.
JSON structure: { "name": "Kitly", "version": "2.1.0", "port": 5432, "features": ["auth", "billing", "analytics"], "config": { "debug": false, "maxRetries": 3, "timeout": 30000 } }.
Final sprint! Type this as fast as you can while staying accurate: The 7 developers shipped 23 features in 14 days, fixed 89 bugs, wrote 4,512 lines of code, and mass-deployed to 3 regions (us-east-1, eu-west-2, ap-south-1) with 99.97% uptime. Total cost: $2,847.63/month. ROI: 340%.
Great work. Your fingers are warmed up. Now go build something.`,
    },
    {
        id: "musk",
        title: "Impossible Bets",
        hook: "Three rockets exploded. There was money left for exactly one more.",
        text: `Elon Reeve Musk was born on June 28, 1971, in Pretoria, South Africa. His childhood was difficult. He was bullied severely at school. Once, a group of boys threw him down a flight of stairs and beat him until he blacked out. He spent 2 weeks in the hospital. His home life was not much better. He later described his father as a "terrible human being." Books and computers became his escape.
At age 10, Musk got his first computer, a Commodore VIC-20 (the same model that hooked Linus Torvalds). He taught himself to code by reading the manual cover to cover. At age 12, he sold his first piece of software: a space-themed game called Blastar, for approximately $500. A 12-year-old, in 1983, selling code he wrote himself. That should tell you something about what is possible when curiosity meets determination.
At 17, he left South Africa for Canada with almost nothing. He had about $2,000, a few belongings, and no real connections. He worked odd jobs: shoveling grain at $18/hour, cutting logs at a lumber mill, cleaning boilers at a lumber yard. He eventually transferred to the University of Pennsylvania, where he earned 2 degrees: one in economics (Wharton School) and one in physics.
In 1995, at age 24, Musk and his brother Kimbal started Zip2, a city guide software company, with $28,000 from their father. They could not afford an apartment and slept in the office. They had 1 computer that ran the website during the day and compiled code at night. In 1999, Compaq bought Zip2 for $307 million. Musk's share: $22 million. He was 27.
Most people would retire. Musk poured $10 million into a new company called X.com, an online payment service. It merged with a competitor called Confinity (founded by Peter Thiel and Max Levchin). The merged company became PayPal. In 2002, eBay acquired PayPal for $1.5 billion. Musk's share: approximately $165 million after taxes.
Here is where the story gets wild. Instead of buying an island and relaxing, Musk invested almost everything into 3 companies simultaneously.
SpaceX (2002): $100 million. The goal was to make rockets reusable and eventually colonize Mars. The first 3 rocket launches failed. The first Falcon 1 exploded 25 seconds after liftoff on March 24, 2006. The second failed on March 21, 2007. The third failed on August 3, 2008. Each failure cost approximately $30 million. By the summer of 2008, Musk was nearly bankrupt. He had enough money for exactly 1 more launch. On September 28, 2008, the 4th Falcon 1 launch succeeded. It was the first privately developed liquid-fuel rocket to reach orbit. NASA awarded SpaceX a $1.6 billion contract shortly after.
Tesla (2004): $6.35 million in the Series A round (Musk became chairman). The company nearly died in 2008 during the financial crisis. At one point, Tesla had less than $9 million in the bank and was spending $4 million per month. Musk put in his last $20 million. The company survived by closing a $40 million round on Christmas Eve 2008, literally hours before it would have gone bankrupt. Today, Tesla is worth over $500 billion and has delivered millions of electric vehicles worldwide.
SolarCity (2006): Musk provided the initial concept and $10 million in funding. His cousins Lyndon and Peter Rive ran it. It became the largest solar panel installer in the United States before Tesla acquired it in 2016 for $2.6 billion.
The numbers are mind-bending. Between 2002 and 2008, Musk went from having $180 million to borrowing money for rent. He was divorced, nearly bankrupt, watching his rockets explode, and being told by everyone that both SpaceX and Tesla would fail. He could not sleep. He had anxiety attacks. He described 2008 as "the worst year of my life."
But he did not quit. And that single decision (to keep going when every rational analysis said stop) is the difference between Elon Musk the cautionary tale and Elon Musk the richest person on the planet.
There are things to critique about Musk. His management style is brutal. His promises often miss deadlines by years. He makes controversial statements. He is polarizing. But whether you admire him or not, there is no denying the factual record: he took on 3 industries (banking, automotive, aerospace) that were dominated by giant incumbents and disrupted all 3 before he turned 50.
What can you take from this? A few things.
First, money follows problems solved. Every company Musk built addressed a real problem. PayPal made online payments easier. Tesla made electric cars desirable. SpaceX made space access 10x cheaper. If you want to build something valuable, start by finding a problem that matters.
Second, the worst-case scenario is survivable. Musk was nearly bankrupt. His rockets kept exploding. His marriage fell apart. He survived all of it. The fear of failure is almost always worse than the failure itself. Most "catastrophic" outcomes are really just uncomfortable starting points for the next chapter.
Third, speed matters more than perfection. Tesla's early cars had build quality issues. SpaceX's first 3 rockets blew up. The Cybertruck was announced in 2019 and did not ship until late 2023. But moving fast, iterating, and learning from crashes (literal and figurative) got results faster than waiting for everything to be perfect.
Fourth, your background does not determine your ceiling. Musk came from South Africa with $2,000. He shoveled grain. He cleaned boilers. He slept in his office. None of that stopped him from building a $200+ billion empire. Where you start is not where you finish.
The next time your code breaks at 2:00 AM, or your app crashes on launch day, or a client says "no," or you feel like you are not making progress fast enough, remember this: the guy who is trying to put humans on Mars almost went bankrupt 3 times, watched $90 million worth of rockets explode, and kept going anyway.
Keep typing. Keep building. Keep launching.`,
    },
    {
        id: "internet",
        title: "The Internet in Numbers",
        hook: "From 4 computers and a 2-letter crash to 2 billion websites.",
        text: `This is a story told entirely in facts, figures, and data. It is the story of how the internet grew from a 4-node experiment to the largest network in human history. Every number here is real. Every stat is something worth knowing. And every character is something your fingers need to practice.
In 1969, ARPANET connected 4 computers. They were located at UCLA, Stanford Research Institute (SRI), UC Santa Barbara, and the University of Utah. The first message ever sent was "LO" (it was supposed to be "LOGIN" but the system crashed after 2 characters). Total bandwidth: roughly 50 kbps. Total users: about 40 researchers.
By 1974, there were 62 nodes on ARPANET. Vint Cerf and Bob Kahn published the TCP/IP protocol that year. The paper was titled "A Protocol for Packet Network Intercommunication." It was 22 pages long and changed everything. The core ideas in that paper still power the internet you are using right now, 50+ years later.
The Domain Name System (DNS) was introduced in 1984. Before that, every computer on the internet was identified only by its IP address (like 192.168.1.1 or 10.0.0.1). The first .com domain ever registered was symbolics.com on March 15, 1985. By the end of 1985, there were only 6 .com domains total. Today, there are over 350 million registered domain names across all extensions (.com, .net, .org, .io, .dev, .ai, etc.).
Tim Berners-Lee invented the World Wide Web in 1989 at CERN (the European Organization for Nuclear Research in Geneva, Switzerland). He wrote the first web browser and the first web server on a NeXT computer. The first website went live on August 6, 1991 at http://info.cern.ch/hypertext/WWW/TheProject.html. It was a plain text page explaining what the World Wide Web was. No images, no CSS, no JavaScript. Just text and hyperlinks.
The growth that followed was exponential. Number of websites over time: 1991: 1. 1993: 130. 1995: 23,500. 1997: 1,117,255. 2000: 17,087,182. 2005: 64,780,617. 2010: 206,956,723. 2015: 863,105,652. 2020: 1,295,973,827. 2024: approximately 1,980,000,000. That is nearly 2 billion websites, and the number keeps climbing.
Let's talk about speed. Dial-up internet (1990s) ran at 56 kbps. That means downloading a single 5 MB MP3 file took about 12 minutes. A 700 MB CD image? Nearly 28 hours. Today, the average global broadband speed is approximately 90 Mbps (that is 1,607 times faster than dial-up). South Korea and Singapore lead with average speeds exceeding 250 Mbps. Fiber connections in some cities reach 10 Gbps, which is 178,571 times faster than a 56k modem.
Email statistics (per day in 2024): approximately 347.3 billion emails sent worldwide. About 45.6% of all email is spam. The average office worker receives 121 emails per day and sends about 40. Gmail has over 1.8 billion active users. The first email was sent in 1971 by Ray Tomlinson. He chose the @ symbol to separate the user name from the computer name. He later said the first email's content was probably "QWERTYUIOP" or something similarly forgettable.
Social media numbers (2024): Facebook: 3.07 billion monthly active users. YouTube: 2.49 billion. Instagram: 2.04 billion. TikTok: 1.58 billion. X (formerly Twitter): 619 million. LinkedIn: 424 million. Reddit: 267 million. Total social media users worldwide: approximately 5.04 billion (62.3% of the global population of 8.1 billion).
E-commerce data: global e-commerce sales in 2024 reached approximately $6.33 trillion. Amazon's revenue: $574.8 billion (2023). Shopify powers over 4.6 million online stores. The average cart abandonment rate is 70.19%. The best-converting product pages load in under 2.5 seconds. Every additional second of load time decreases conversions by roughly 7%.
Developer ecosystem: GitHub has over 100 million developers and 420+ million repositories. npm serves over 2.1 billion package downloads per week. Stack Overflow has over 58 million questions and 23 million registered users. The most popular programming languages (2024 by usage): JavaScript (1st for 11+ years running), Python (2nd), TypeScript (3rd), Java (4th), C# (5th).
Some fun data for your typing practice. IP addresses: 192.168.0.1, 10.0.0.254, 172.16.0.100, 255.255.255.0, 0.0.0.0, 127.0.0.1, ::1, fe80::1%lo0, 2001:0db8:85a3:0000:0000:8a2e:0370:7334. MAC addresses: 00:1A:2B:3C:4D:5E, AA:BB:CC:DD:EE:FF. HTTP status codes: 200 OK, 201 Created, 301 Moved Permanently, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.
Common file sizes: 1 byte = 8 bits. 1 KB = 1,024 bytes. 1 MB = 1,048,576 bytes. 1 GB = 1,073,741,824 bytes. 1 TB = 1,099,511,627,776 bytes. 1 PB = 1,125,899,906,842,624 bytes. Google processes approximately 8.5 billion searches per day. That is roughly 99,000 searches per second. Every minute, YouTube users upload 500+ hours of video, Instagram users share 66,000 photos, and WhatsApp users send 41.6 million messages.
The internet consumes approximately 10% of the world's total electricity. Data centers alone use about 1.5% of global electricity (roughly 300 TWh/year), which is more than many entire countries. A single Google search uses about 0.3 Wh of energy (enough to power a 60W light bulb for 18 seconds). Training GPT-4 reportedly consumed approximately 50 GWh of electricity and cost over $100 million in compute alone.
The bottom line? The internet started with 4 computers and a 2-letter crash. Today it connects 5.35 billion people, processes trillions of dollars in commerce, and generates 402.74 million terabytes of data every single day. Every one of those connections, every one of those transactions, every one of those bytes was made possible by people who sat at keyboards and typed.
Just like you are doing right now. Keep going.`,
    },
    {
        id: "ada",
        title: "Ada Lovelace",
        hook: "She wrote software a century before anyone built a machine to run it.",
        text: `Ada Lovelace was born in London in 1815. Her father was the poet Lord Byron, who left when she was one month old and never came back. Her mother, terrified that Ada would inherit her father's wild imagination, filled her days with mathematics instead of poetry. The plan backfired beautifully. Ada grew up with both.
At seventeen she met Charles Babbage, an inventor who was building a mechanical calculating machine out of brass gears and cranks. Most people saw a very expensive adding machine. Ada saw something else entirely.
In 1843 she translated an Italian article about Babbage's proposed Analytical Engine. Translation was considered suitable work for a woman of her position. So she translated it, and then she added her own notes at the end. The notes were three times longer than the article.
Inside those notes, labelled simply Note G, is a step by step method for the machine to calculate a sequence of numbers called Bernoulli numbers. It has loops. It reuses intermediate results. It is, by any reasonable definition, a computer program, written for a computer that was never finished, roughly one hundred years before the first working machine existed.
But the program is not even the most remarkable part. Babbage thought his engine would do arithmetic. Ada wrote that if you could represent something with symbols, the engine could operate on it, and that it might one day compose elaborate pieces of music. She understood, alone and in advance, that a computer is not a calculator. It is a machine for manipulating meaning. Everything you have ever done on a screen rests on that single insight.
She also wrote the first honest warning about hype. The Analytical Engine, she said, has no pretensions to originate anything. It can do whatever we know how to order it to perform. People are still quoting that line in arguments about artificial intelligence today.
Ada died at thirty six. Her notes sat in obscurity for a century until Alan Turing read them while working on the foundations of modern computing.
There are two things worth keeping from her story. The first is that the most valuable contribution is often the part nobody assigned to you. She was asked to translate. She chose to think. The notes were extra, unrequested, and they are the reason we still say her name.
The second is that being early looks exactly like being wrong, right up until it does not. Nobody could use her work. There was no machine. There was no industry, no job title, no community. She wrote it anyway, because she could see it, and seeing it clearly was enough of a reason.
You are typing on the far end of that idea. Keep going.`,
    },
    {
        id: "hopper",
        title: "Grace Hopper",
        hook: "They told her computers could only do arithmetic. She disagreed, loudly.",
        text: `Grace Hopper joined the United States Navy in 1943, at the age of thirty seven. She was told she was too old and too small, and she went anyway. They assigned her to a project at Harvard, where she walked into a room and met the Mark I, a computer fifty one feet long, eight feet high, and full of switches, relays and rotating shafts.
Nobody handed her a manual, because there was no manual. She wrote one. It ran to five hundred and sixty one pages, and it was the first programming manual for the first large scale automatic computer in the United States.
In 1947, a team working on the Mark II found the machine failing and traced the fault to a moth caught in one of the relays. They taped the moth into the logbook with the note, first actual case of bug being found. Hopper loved the story and told it for decades, which is why every developer alive still says debugging.
Her real revolution came later and was much harder to win. In the early 1950s, programs were written in raw machine code, in numbers. Hopper argued that people should be able to write instructions in something close to English, and that the computer itself should translate those instructions into numbers. She was told repeatedly that this was impossible, and that computers could only do arithmetic.
She built it anyway. In 1952 she completed the A-0 compiler, the first program that took human readable code and produced machine code from it. Every compiler, interpreter, transpiler and build tool you have ever run is a descendant of that idea.
She kept pushing. She led the work that became COBOL, a language written so that business people, not just mathematicians, could read what a program did. Decades later, COBOL still quietly runs a very large share of the world's banking and government systems.
Hopper also carried a length of wire, about thirty centimetres long, which she handed to visitors. That, she explained, is a nanosecond, the distance light travels in a billionth of a second. It is why your program is slow when it talks to a machine on the other side of the country. She was teaching latency with a piece of wire in the 1960s.
She retired from the Navy at seventy nine as a rear admiral, the oldest serving officer in the United States at the time.
Her most quoted line is a good one to keep near your desk. The most damaging phrase in the language, she said, is, we have always done it this way.
Somebody once told her that her idea was impossible. She had already written it. Keep typing.`,
    },
    {
        id: "hamilton",
        title: "The Code That Landed on the Moon",
        hook: "Three minutes from the surface, the computer started throwing errors.",
        text: `On the twentieth of July, 1969, the lunar module Eagle was falling toward the surface of the moon with two men inside it. At about three minutes from landing, the onboard computer began flashing an alarm code that nobody in the cabin recognised. Then it flashed another. The astronauts asked mission control what a 1202 alarm was, and whether they should abort.
They did not abort. They landed, with roughly twenty five seconds of fuel remaining, because of software written by a team led by a young engineer named Margaret Hamilton.
Hamilton had joined the Apollo project at MIT almost by accident. She had been working on weather prediction software, then on air defence systems, at a time when the phrase software engineering did not exist. She coined it herself, partly as a joke and partly as an argument, because the hardware people did not consider what she did to be engineering at all.
The Apollo Guidance Computer had about seventy six kilobytes of memory. Your phone has more memory in a single frame of video. The programs were literally woven by hand into rope core memory, wire threaded through tiny magnetic rings, one bit at a time, by textile workers.
Hamilton insisted on something the schedule pressure said was unnecessary. She wanted the software to detect when it was being asked to do more than it could handle, and to decide for itself what mattered most. Her team built priority scheduling and error recovery into the system, and they were told more than once that it was a waste of effort because astronauts are trained professionals who do not make mistakes.
Three minutes from the moon, a rendezvous radar switch had been left in the wrong position, and the computer was being flooded with data it did not need. It was being asked to do more work than it had time for. Instead of freezing or crashing, it did exactly what Hamilton had designed it to do. It threw away the low priority tasks, reported what it had done with those alarm codes, and kept running the landing.
The software did not fail. It reported that it was overloaded and then handled it.
Hamilton had also fought earlier for a check that would prevent a crew from accidentally wiping the navigation data mid flight. She was overruled, because astronauts do not make mistakes. On Apollo 8, an astronaut made exactly that mistake, and the recovery took a frantic nine hours of work from her team.
There is a famous photograph of Hamilton standing beside a stack of printouts of the Apollo code, and the stack is taller than she is.
The lesson is not that she was clever, though she was. It is that she took the failure case seriously when nobody was rewarding her for it. Good engineering is mostly what happens when things go wrong.
Write the error handling. Keep typing.`,
    },
    {
        id: "ritchie",
        title: "Dennis Ritchie",
        hook: "The quietest man in computing built the floor everything else stands on.",
        text: `In 1969, at Bell Labs in New Jersey, a research project called Multics was cancelled. Two of the engineers left on it, Ken Thompson and Dennis Ritchie, had grown fond of working on an interactive system and did not want to go back to punch cards. They found a discarded PDP-7 minicomputer in a corner and started building a small operating system on it, unofficially, without a budget.
That system became Unix. To write it properly, Ritchie needed a language that was close enough to the machine to be fast but human enough to read. Between 1972 and 1973 he created C.
It is difficult to overstate what happened next. Before C, operating systems were written in assembly language, which meant they were welded to one specific processor. Ritchie and Thompson rewrote Unix in C, and suddenly an operating system could be moved to different hardware by recompiling it. Software stopped being a prisoner of the machine it was born on.
Today, C or its direct descendants are underneath essentially everything you touch. The Linux kernel is C. Windows and macOS are largely C and C++. Python's reference implementation is written in C. So is Ruby's, and PHP's, and the SQLite database that is running inside your phone right now. JavaScript engines are C++. The firmware in your microwave is probably C. Objective-C, C++, C#, Java, Go and Rust all borrowed their basic shape from it.
Ritchie also co-wrote the book. The C Programming Language, by Kernighan and Ritchie, is about two hundred and seventy pages, and it taught a generation how to program. It is where hello, world comes from. It is still readable today, which is more than can be said for most technical books written half a century ago.
He was famously understated about all of it. He described C as quirky, flawed, and an enormous success, which is one of the most honest sentences ever written about a piece of software.
Ritchie died in October 2011, a week after Steve Jobs. The world barely noticed, which is its own kind of poetry. Jobs built the thing people could see. Ritchie built the thing it was standing on. The machine Jobs made his fortune with runs an operating system descended from Unix, written in Ritchie's language.
There is a lesson in that for anyone building quietly. Most of the important work in any field is invisible, and the people who do it are usually not the people getting photographed. Infrastructure does not trend. It just holds.
If you want to matter for fifty years, build the thing other people build on. Keep typing.`,
    },
    {
        id: "python",
        title: "Designing for Humans",
        hook: "A holiday project, named after a comedy show, now taught in every school.",
        text: `In December 1989, a Dutch programmer named Guido van Rossum had a quiet week off over Christmas and decided he needed a hobby project. He wanted a scripting language that was more capable than shell scripts but less punishing than C. He named it Python, not after the snake, but after Monty Python's Flying Circus, because he was in a good mood and the name made him laugh.
The design choices he made in that week are why the language ended up everywhere.
He made whitespace meaningful, so that badly indented code simply would not run. Programmers argued about this for twenty years. The result is that almost all Python code, from any author, in any country, looks roughly the same, and you can read a stranger's file without a fight.
He made the syntax read like English. If a list is empty. For each item in items. It sounds obvious now. It was not obvious then, when the alternatives were full of braces, semicolons and type declarations that a beginner had to memorise before printing a single word.
He kept the language small enough to hold in your head, and pushed the complexity into libraries instead.
The philosophy was eventually written down as a short poem that ships inside the language itself. Type import this in a Python prompt and you get it. Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex. Readability counts. There should be one, and preferably only one, obvious way to do it.
Notice what those lines are about. Not speed. Not power. Not cleverness. They are all about the human being who has to read the code six months later, and that person is usually you.
The payoff took decades and then arrived all at once. Scientists picked up Python because they wanted to do work, not fight a compiler. That brought NumPy, then pandas, then scikit-learn, then TensorFlow and PyTorch. Nearly the entire modern machine learning field is built in a language designed by one man on a Christmas break to be easy to read.
Van Rossum spent years as what the community called the Benevolent Dictator For Life, settling arguments about the language's direction, until he stepped down in 2018 after one debate became too exhausting. He described the role honestly, as unglamorous work that mostly involved saying no.
The lesson is not about Python. It is that optimising for the reader is a superpower with a very long fuse. Clever code wins the afternoon. Clear code wins the decade.
Write it so the next person understands it. Keep typing.`,
    },
    {
        id: "wikipedia",
        title: "The Encyclopedia Anyone Could Break",
        hook: "Every expert said an encyclopedia strangers could edit would be worthless.",
        text: `In January 2001, a project called Nupedia was in trouble. It was an attempt to build a free online encyclopedia, written by credentialed experts and pushed through a seven stage peer review process. It was rigorous, it was serious, and after a full year of work it had produced about twenty one articles.
Someone suggested a side experiment. Put up a wiki, a kind of website where any visitor can edit any page directly in the browser, and use it as a rough drafting space to feed the real encyclopedia. Several of the experts objected to being associated with something so undignified. The side experiment was given its own domain to keep it away from the main project.
In its first month, that side experiment produced more articles than Nupedia had in a year. Within a year it had twenty thousand. Nupedia was quietly shut down in 2003. The scratchpad had become Wikipedia.
Every reasonable person predicted it would fail. If anyone can edit anything, vandals will win, and the whole thing will collapse into graffiti and nonsense. It was an obvious argument, and it was wrong for a subtle reason. Destroying a page takes one person a few seconds. Repairing it also takes a few seconds, and there are far more people who want the page to exist than people who want it gone. The maths of good faith works out, as long as fixing is as easy as breaking.
Today Wikipedia holds more than sixty million articles across roughly three hundred languages. It is consistently among the ten most visited websites in the world. It carries no advertising, sells no data, and is written and maintained by volunteers who receive nothing for it except the knowledge that the article is now better than it was.
Studies comparing its science articles to traditional encyclopedias have repeatedly found error rates in the same range. Not perfect. Comparable. Built by strangers, for free, in public.
There are real problems. Coverage is uneven, and it leans heavily toward the languages and subjects of the people who happen to have time to write. Arabic Wikipedia, serving hundreds of millions of speakers, has a fraction of the depth of the English one. That gap is not a law of nature. It is just work nobody has done yet.
Which is the actual lesson. The thing you keep waiting for someone qualified to build is usually waiting for someone stubborn instead. The person who writes the missing article is rarely the world expert. It is the person who noticed it was missing and had an evening free.
Something is missing in your language, in your field, in your city. Go and write it. Keep typing.`,
    },
    {
        id: "miyamoto",
        title: "The Man Who Made Play a Career",
        hook: "A failed art student with no game experience was handed a doomed arcade cabinet.",
        text: `Shigeru Miyamoto grew up in rural Japan in the 1950s, in a house with no television and no money for toys. He spent his childhood walking through fields and forests near Kyoto. One day he found the entrance to a cave, went back with a lantern, and crawled inside. He never forgot that feeling: no map, no instructions, just a dark opening and the decision to go in.
He studied industrial design, drew a lot, played the banjo, and graduated without much of a plan. His father knew someone at a playing card company called Nintendo, and in 1977 Miyamoto talked his way into a job designing artwork for the cabinets of arcade machines.
In 1980 Nintendo had a disaster. They had shipped thousands of an arcade game called Radar Scope to America and almost nobody wanted it. The warehouses were full of unsold cabinets. The company needed a new game that could be loaded onto the existing hardware to rescue the inventory, and every experienced designer was busy. So the job went to the young artist who had never designed a game in his life.
Miyamoto did something nobody in arcades was doing. He started with a story rather than a mechanic. A carpenter, his girlfriend, and an ape that has taken her to the top of a construction site. He gave the character a hat because hair was hard to animate, and a moustache because a mouth was hard to draw at that resolution, and overalls so you could see his arms move. The technical limits designed the most recognisable character in video game history.
The game was Donkey Kong. It made Nintendo about one hundred and eighty million dollars and saved the American branch of the company. The carpenter was later renamed Mario.
What came next mattered more. Super Mario Bros. taught players how to play without a single line of instruction: an open space, an enemy walking toward you, a block above your head, and the discovery that jumping solves all three. Then he built The Legend of Zelda, which was that cave from his childhood turned into a world, an open landscape handed to you with no directions and the expectation that curiosity would be enough.
His method never really changed. He is known for pulling a nearly finished game apart if it is not fun, on the grounds that a delayed game is eventually good but a bad game is bad forever. He has said his job is not to make games. It is to find the fun and then build the game around it.
That is a strange and useful way to look at your own work. Not what feature should I add, but where is the part that people actually enjoy, and how do I get more of that.
Find the fun. Then build around it. Keep typing.`,
    },
    {
        id: "drill-basics",
        title: "Home Row Warm-Up",
        hook: "Short. Every finger, every letter, no story to get lost in.",
        text: `Fingers on the home row. Left hand on a s d f, right hand on j k l and the semicolon. Both thumbs resting on the space bar. Do not look down. If you lose your place, feel for the two small bumps on f and j and start again.
asdf jkl; asdf jkl; fjfj dkdk slsl a;a; fjdk sla; fjdk sla;
Now the index fingers reach: fgfg jhjh fgfg jhjh gfgf hjhj frf juj ftf jyj
The middle fingers go up and down: ded kik ded kik dcd k,k ded kik
The ring fingers: sws lol sws lol sxs l.l sws lol
The little fingers, the weakest ones, need the most work: aqa ;p; aza ;/; aqa ;p; aqa ;p;
Words now, slowly, all from the home row: a lad had a flask. dad falls. all a lass asks. a glass fell. half a salad. flash a flag.
Add the top row: we type quiet words to test our hands. the outer keys prefer a lighter touch.
Add the bottom row: an example of common back and forth movement between rows.
Full sentences. Do not chase speed. Speed is what accuracy turns into on its own.
The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly at dawn. Sphinx of black quartz, judge my vow. Jackdaws love my big sphinx of quartz.
Capitals, using the opposite shift key each time: Amman. Baghdad. Cairo. Damascus. Erbil. Fallujah. Gaza. Hilla. Istanbul. Jeddah. Karbala. Latakia. Mosul. Najaf. Oman. Petra. Qatar. Riyadh. Samarra. Tunis. Ur. Van. Wasit. Xanthos. Yemen. Zakho.
Punctuation, lightly: Yes, of course. No, not today. Wait, why? Stop! Fine; carry on. Ready: begin.
Last pass. Relax your shoulders, keep your wrists floating, and let the rhythm stay even. Even beats fast. Even becomes fast.
Well done. Your hands are awake now.`,
    },
];

/** Roughly how big a piece is, without putting a stopwatch anywhere near it. */
export function sizeOf(sample: Sample): "short" | "medium" | "long" {
    if (sample.text.length < 1800) return "short";
    if (sample.text.length < 4200) return "medium";
    return "long";
}

export function nextSampleAfter(id: string): Sample | null {
    const i = SAMPLES.findIndex((s) => s.id === id);
    if (i === -1) return null;
    return SAMPLES[(i + 1) % SAMPLES.length];
}

export function randomSample(exclude?: string): Sample {
    const pool = SAMPLES.filter((s) => s.id !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
}
