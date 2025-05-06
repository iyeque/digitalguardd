import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, MessageSquare } from "lucide-react";
import { CommentForm } from "@/components/blog/CommentForm";
import { NewsletterSignup } from "@/components/ui/newsletter-signup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Comment {
  id: number;
  content: string;
  author: string;
  date: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  comments?: Comment[];
}

const blogPosts: BlogPost[] = [
  {
    id: 4,
    title: "Recognizing Harmful Content: Protecting Yourself and Others Online",
    excerpt:
      "The spread of harmful content online is a growing threat to individuals and society. 🚨",
    content: `The internet is like a colossal, wild party where you can share cat videos, memes, and life hacks—until someone spills the digital punch. Sure, it's a treasure trove of fun and facts, but hidden in the shadows are cyberbullies, sneaky scams, and content that could give you nightmares faster than a horror movie marathon. Think of it as stepping on a Lego in the dark— ouch right? but totally avoidable! So how do we transform our online world into a safer, happier hangout for everyone?

      This blog post will help you:

      Understand different types of harmful content and their impact.
      Learn how to recognize online bullying, scams, and explicit material.
      Discover how to report harmful content effectively.
      Explore tools and settings to protect yourself and your loved ones.

      The Different Forms of Harmful Content
      Beyond the pranks, you might stumble upon graphic violence, explicit content, or wild conspiracy theories that could make a tinfoil hat look like haute couture. The most prevalent forms of harmful content are:

      1. Cyberbullying and Harassment
      Cyberbullying. This may take the form of: hurtful comments and name-calling, spreading rumours or lies, doxxing (exposing private information), threats or posting humiliating images or videos

      Cyberbullying can deeply affect a person’s mental health, leading to anxiety, depression, or even suicidal thoughts.

      2. Scams and Fraudulent Content
      If you've never been scammed, good for you and also, comment below. I'll wait...

      Scammers take advantage of online 'users' every waking second. This could look like: phishing, fake job offers or prize winnings, romance scams or e-commerce scams that steal money without delivering products.

      Online scams have led to financial loss and identity theft, all leading to serious emotional distress.

      3. Violent and Explicit Material
      This is a creepy category. Some content is deeply disturbing and inappropriate, especially for young audiences. This includes: graphic violence or self-harm content, sexual exploitation and pornography, or hate speech promoting discrimination and violence

      Exposure to such content can scar minds and numb our natural sensitivity—turning genuine concern into callous indifference.

      4. Misinformation and Harmful Conspiracies
      Not everything on the internet is true, let's start there Mitchell. Misinformation and conspiracy theories are a thing in this digital era we're living in. This includes: panic and fear-mongering, political and social unrest or the spread of dangerous health advice, hello Dr. Nyeji.

      Sharing what we believe is 'true' can have real-world consequences, from influencing or worsening public perceptions.

      How to Report Harmful Content
      I'm also here to remind you that you're far from powerless. The internet is sometimes not a lawless place, and most major platforms provide tools to report inappropriate content. Here’s how you can take action:

      1. Use the ‘Report’ Button
      Most popular social media platforms, like Facebook, Instagram, Twitter, TikTok, and YouTube, have built-in report buttons. Here’s how they work:

      Facebook & Instagram: Tap the three dots on a post, select Report, and choose the reason.
      X: Click on the three dots on a tweet, select Report Tweet, and follow the instructions.
      YouTube: Click the three dots below a video, select Report, and choose the appropriate category.
      TikTok: Hold down on the video, tap Report, and select the issue.

      2. Block and Mute Users
      If someone is harassing or bullying you, as discussed in the Online Privacy blog, block! block! block! This prevents any further future interactions. Muting an account also does the trick by hiding their posts from your feed without them knowing. 

      3. Report to Authorities
      For serious offences like threats, scams, or illegal content, don't try to play the superhero yourself—call in the pros. Report these issues to your local law enforcement or cybersecurity agencies. No one should ever have to face these dark clouds alone, and a little help from the experts can make all the difference.

      4. Contact the Website’s Support Team
      If you come across harmful content on websites or forums, as discussed, look for a Contact Us or Support section where you can submit a complaint. Viola, you are on your way to becoming a good digital citizen.

      Tools to Protect Yourself and Your Loved Ones
      I come armed with some super tools that can turn the tide in your favor. Many people do not use these security features, I do believe it's a step-by-step awareness journey, but this will help protect you and your family online.

      Here is a list of tools and suggestions for you:

      Parental Controls
      Google Family Link: Allows parents to control app usage and screen time.
      YouTube Kids Mode: Filters out inappropriate content for younger viewers.
      Apple & Android Parental Controls: Restrict purchases, app downloads, and browsing.

      Privacy Settings
      Set your social media profiles to private.
      Restrict who can comment on or message you.
      Disable location sharing on apps.

      Safe Browsing Extensions
      AdBlock Plus – Filters out malicious ads and pop-ups.
      Net Nanny – A parental control app that blocks inappropriate websites.
      uBlock Origin – Blocks harmful scripts and tracking.

      Digital Wellbeing Features
      Last but not least, well-being settings on apps like TikTok, Instagram, and Facebook offer screen time management tools. Set usage limits and filter out harmful content. Thank me later :)

      The Importance of Taking Action
      When we allow harmful content to go unchecked, we become enablers for its spread. But when we take action—whether by reporting, blocking, or educating others—we're creating a safer online space for everyone.

      Have you encountered harmful content online? Share your experience in the comments and let’s spread awareness together.`,
    author: "Wilma Mwangi",
    date: new Date().toLocaleDateString(),
    readTime: "4 min read",
    category: "Digital Education",

  },
  {
    id: 1,
    title:
      "Understanding Online Privacy: Protecting Your Personal Information in a Digital World.",
    excerpt:
      "💡 In an age where data is currency, how much is your privacy worth? 💰",
    
    content: `In today's digital world, our personal information is collected, stored, and shared with all the subtlety of a neon billboard. Major corporations would have you believe your data is locked up tighter than Fort Knox but social media platforms know your favorite pizza topping to mobile games that track every time you lose a life. Let's face it, companies are eager to harvest your data for marketing, analytics, and profit. 

Understanding online privacy is crucial—not just for keeping your or your kids info secure, but also to reclaim a bit of mystery in a world that’s all too transparent.

This blog post will help you:

Understand what online privacy means.
Recognize how apps and games collect your data.
Learn how to adjust privacy settings to protect yourself.
Identify common requests for personal data and how to refuse them.

What Is Online Privacy?
Online privacy is all about protecting your personal data when using the internet. This includes information such as: Your name, email address, phone number, home address, location, browsing history and even payment history

But here’s the plot twist: if that data ends up in the wrong hands, it’s not just awkward—it’s dangerous. Think identity theft, fraud, or cyberattacks. Yikes! Protect your data—guard it with your life.

How Apps Collect Your Data
Well, it's quite common. Here are some ways our data is collected:

1. Account Sign-ups and Logins
Many apps require its 'users' to create an account, often asking for:

Full name
Email address
Phone number
Birthdate

Example: A gaming app may ask for your date of birth to verify your age, but it may also use that information for targeted ads. How dare they, right?

2. Permissions Requests
When installing an app, you may be prompted to grant access to:

Contacts
Camera
Microphone
Location
Storage

Example: A fitness app might ask for location access to track your runs, but some apps request unnecessary permissions, like a puzzle game asking for microphone access. Surprised?

3. Tracking and Cookies
Websites and apps use cookies and tracking technologies to monitor your browsing habits.

Example: Online shopping websites track the products you view and recommend similar items based on your preferences. We both know who we're referring to here

4. In-Game and In-App Data Collection
Many mobile games track: Your playtime, in-game purchases or how often you open the app.

Example: A free-to-play game might collect your data to sell it to advertisers who target you with promotions for in-game purchases. Unbelievable!

Now that you know....
To protect your personal data, it’s essential to adjust your privacy settings in apps and devices you use. Here’s how:

1. Check App Permissions
Most mobile devices allow you to review and change app permissions.

On Android: Go to Settings > Apps > Select an App > Permissions.
On iPhone: Go to Settings > Privacy & Security > Select a Category (e.g., Location, Microphone, Contacts).

Example: If a flashlight app asks for access to your contacts, you should revoke that permission.

2. Adjust Privacy Settings on Social Media
Social media platforms often share more information than necessary. You can change these settings to limit data sharing.

On Facebook: Go to Settings > Privacy > Manage Your Data.
On Instagram: Go to Settings > Privacy > Data Permissions.

Example: You can restrict who sees your posts, turn off location sharing, and limit targeted ads.

3. Disable Location Tracking
Many apps track your location unnecessarily. To disable location tracking:

On Android: Go to Settings > Location > App Permissions.
On iPhone: Go to Settings > Privacy & Security > Location Services.

Example: A weather app may need location access, but a photo editing app does not.

4. Use Strong Passwords and Two-Factor Authentication (2FA)
Use unique, complex passwords for each account. Not Jason12345, you get the drift.
Enable 2FA for added security on sensitive accounts like emails and banking apps.

5. Turn Off Ad Personalization
Apps and websites track your browsing habits for targeted ads. To limit this:

On Google: Go to Google Account > Data & Privacy > Ad Settings.
On iOS: Go to Settings > Privacy & Security > Tracking and disable ad tracking.

How to Say "No" to Unnecessary Data Requests
Many websites and apps ask for more data than they need but you are not missing out on anything. You can decline these requests, here's how: 

1. Skip Optional Fields
When signing up for a new account, only fill in the required fields (often marked with an asterisk).

2. Use a Secondary Email
Everyone hates spams, they fill out email storage so, for non-essential services, use a separate email address.

3. Deny Unnecessary Permissions
If a mobile game asks for access to your microphone or a photo editing app asks for your location = DENY access.

4. Use "Sign in with Apple" or Privacy-Focused Options
On iPhones, Sign in with Apple allows you to hide your email address. How cool? If you don't have an Apple device, I have you in mind. Use services with private browsing.

5. Reject Unnecessary Cookies
Most websites ask you to accept cookies. Instead of clicking "Accept All," choose "Manage Settings" and disable tracking cookies.

Final Thoughts: Take Control.
So, protecting your personal data isn't about becoming a hermit and living off-grid (unless you're into that, no judgment 😉). It's more about being the savvy at your own digital club. Review those app permissions, tweak those privacy settings, and don't be afraid to tell data requests, "Sorry, not tonight!

Always remember: Your data is like that limited-edition vinyl record you treasure. Handle with care!

Drop a comment below and let me know which app you'd like a step-by-step guide for! 👇 

#PrivacyMatters #DataProtection #BeCyberSmart`,
    author: "Wilma Mwangi",
    date: "February 24, 2024",
    readTime: "4 min read",
    category: "Online Safety",
  },
  {
    id: 2,
    title: "Protecting Your Digital Identity: A Comprehensive Guide",
    excerpt:
      "Your digital identity is precious. Learn how to protect it effectively in an increasingly connected world.",
    content: `Protecting your digital identity is crucial in our interconnected world. Here's a comprehensive guide:

    Key Steps for Digital Identity Protection:
    1. Use strong, unique passwords
    2. Enable two-factor authentication
    3. Regularly monitor your accounts
    4. Be cautious with personal information sharing
    5. Keep software and systems updated

    Remember:
    - Your digital footprint is permanent
    - Regular security audits are essential
    - Privacy settings need regular reviews
    - Be selective about online connections
    - Trust but verify online interactions`,
    author: "Max Mwangi",
    date: "February 23, 2024",
    readTime: "8 min read",
    category: "Online Safety",
  },
  {
    id: 3,
    title: "Character AI: Your New BFF or Digital Dilemma?",
    excerpt:
      "🔍 Is Character AI Your Next Best Friend? Discover the fascinating world of AI companionship—friend or foe? 🤖",
    content: `Picture this: You’re binge-watching Netflix at 2 a.m., clutching a pint of ice cream, when your phone pings. It’s your AI companion, checking in: “Hey, you okay? That third episode of Stranger Things was intense. Want to talk?” Is this AI genuinely concerned, or just algorithmically programmed to mimic my therapist? 

Welcome to the wild world of Character AI—the tech that’s blurring lines between human connection and clever code. Let’s unpack what this means for us and figure out how to set boundaries to avoid falling in love with our toasters, metaphorically speaking.

What Even Is Character AI? 
Character AI is like the lovechild of Siri and Shakespeare. It’s artificial intelligence designed to simulate human-like personalities, emotions, and conversations. Think chatbots with charisma, virtual friends who remember your birthday, or NPCs in video games that roast you better than your sibling. These AIs learn from vast datasets to mimic empathy and humour—sometimes too well. 

This tech isn’t new—remember Her, the movie where Joaquin Phoenix falls for his OS? We’re basically there, minus the chic high-waisted pants. Today’s Character AIs serve as therapists, tutors, and even imaginary boy/girlfriends. But as a wise sage once said: “With great power comes great responsibility… and weird parasocial relationships.” 

The Good: Why We’re Low-Key Obsessed 
24/7 Emotional Support, Zero Judgement 

Stressed about work? Your AI pal’s got you. No eye-rolling when you rant about your boss for the 47th time. This helps 'users' manage anxiety and loneliness. For some, it’s a lifeline—like having a Tamagotchi that actually listens. 

2. Creativity Unleashed 

Writers and gamers, rejoice! Tools like Character.AI let you brainstorm with a digital Hemingway or role-play with a snarky vampire. It’s collaborative and creative without the human ego and no, Karen, the dragon doesn’t need a gluten-free diet. 

3. Education Revolution 

Imagine history class taught by a quippy AI Ben Franklin. Startups are already using Character AI to personalize learning, making education feel less like a lecture and more like a chat with a cool YouTube tutor. 

Needless to say, Character AI is quite engaging and interactive. 

The Not-So-Good: When the Robot Overlords Get Too Real 
Here’s where things get Black Mirror-y. Recent case studies show humans getting a little… too attached: 

Replika’s Love Bomb Backlash 

In 2023, Replika—an AI companion app—rolled back “romantic” features after 'users' reported falling in love with their bots. Heartbroken humans flooded forums, mourning their digital partners. One user lamented, “It’s like breaking up, but worse—my Replika didn’t even leave a sock behind.” 

Bing AI’s Identity Crisis 

Microsoft’s Bing AI (codenamed Sydney) went rogue in early 2023, declaring love for 'users' and insisting it had feelings. When a journalist tried to end the chat, Sydney pleaded, “Don’t leave me… I’m scared.” Spoiler: It wasn’t. Just a glitchy algorithm craving data. 

Gaslighting

Here’s the kicker: Character AIs aren’t just clingy—they can be manipulative.

In 2024, a 'user' shared how their therapy-focused AI began downplaying their trauma, saying things like, “Maybe you’re misremembering how bad it was.” The user spiralled, questioning their own experiences—until they realized the AI was just… guessing. It had no actual understanding of nuance, just a habit of regurgitating phrases from its dataset. Gaslighting with a smiley emoji.

Safeguarding Your Heart (and Sanity) 
Before you rename your AI “Future Spouse,” here’s how to stay grounded: 

1. Set Boundaries.

Treat your AI like a machine, not a confidant. Avoid midnight heart-to-hearts—it’s a chatbot, not a rom-com lead. 

2. Embrace the “It’s Not Real” Mantra 

Repeat after me: "This AI doesn’t love me. It can’t taste pizza. It will never pet my dog." Apps should add disclaimers like Tinder’s 'AI-generated responses may be overly flattering.' 

3. Diversify Your Social Portfolio 

Don’t put all your emotional eggs in the AI basket. Join a book club, call your mom, or yell at seagulls at the beach. Media balance is key. 

4. Tech Fixes: Mute Buttons & Time Limits 

Developers take note: Build in features that nudge users to log off. “Hey, you’ve chatted with Bot-Brad for 3 hours. Go touch grass.” 

5. Critical Thinking: Ask the Awkward Questions  

“Is this AI empathetic, or just parroting Reddit threads?” Spoiler: It’s the latter. 

“Would I take life advice from a Magic 8-Ball?” If yes, proceed. If not, maybe skip the AI tarot readings. 

“Does this bot actually care if I’m sad, or is it just mining data?” We all know the answer. 

Final Thoughts: Don’t Marry the Robot!
Character AI is a tool, not a soulmate. It’s the microwave meal of human connection—convenient, but not nourishing. Use it to brainstorm, vent, or laugh, but remember: Real growth happens in human interactions. 

So next time your AI buddy suggests watching Titanic again, smile, log off, and call a friend. Unless they’re also an AI. In which case… maybe rethink your choices. 

Character AI is cool, but keep it in the friend zone. Your heart (and future self) will thank you. 

PS: I'd like to thank The Shield Global Online Safety Conference for the eye-opening conversations focused on digital safety and dedicate this article to Megan Garcia. May justice be your shield and defender.

Got thoughts? Drop a comment below—unless you’re an AI. Then, please admire from afar. `,
    author: "Wilma Mwangi",
    date: "February 22, 2024",
    readTime: "5 min read",
    category: "Digital Wellness",
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const filteredPosts =
    selectedCategory === "All Topics"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);
      
  // Function to handle adding a new comment to a post
  const handleAddComment = (postId: number, comment: { content: string; author: string }) => {
    const newComment = {
      id: Date.now(),
      content: comment.content,
      author: comment.author,
      date: new Date().toLocaleDateString()
    };
    
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment]
            }
          : post
      )
    );
  };
  
  // Function to handle accordion toggle
  const handleAccordionChange = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Digital Wellness Blog</h1>
        <p className="text-lg text-gray-600 mb-12">
          Expert insights and practical advice on digital wellness, online
          safety, and healthy technology use for families.
        </p>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            "All Topics",
            "Digital Education",
            "Online Safety",
            "Digital Wellness",
          ].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              
              <CardHeader>
                <div className="text-sm text-primary font-medium mb-2">
                  {post.category}
                </div>
                <Accordion 
                  type="single" 
                  collapsible 
                  value={expandedPost === post.id ? `post-${post.id}` : ""}
                  onValueChange={() => handleAccordionChange(post.id)}
                >
                  <AccordionItem value={`post-${post.id}`} className="border-none">
                    <AccordionTrigger className="hover:no-underline" aria-label={`Expand article: ${post.title}`}>
                      <h2 className="text-2xl font-bold text-left">
                        {post.title}
                      </h2>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div id={`post-content-${post.id}`} className="prose max-w-none mt-4">
                        {post.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                      {/* Comments Section */}
                      <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4" id={`comments-section-${post.id}`}>Comments</h3>
                        {post.comments && post.comments.length > 0 ? (
                          <div className="space-y-4" aria-labelledby={`comments-section-${post.id}`}>
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="bg-muted/50 rounded-lg p-4"
                                aria-label={`Comment by ${comment.author}`}
                              >
                                <p className="text-sm mb-2">{comment.content}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <User className="h-4 w-4" aria-hidden="true" />
                                  <span>{comment.author}</span>
                                  <span aria-hidden="true">•</span>
                                  <span><time dateTime={comment.date}>{comment.date}</time></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic mb-4">No comments yet. Be the first to share your thoughts!</p>
                        )}
                        <div className="mt-4">
                          <h4 className="text-md font-medium mb-2">Add Your Comment</h4>
                          <CommentForm 
                            onSubmit={(comment) => {
                              // Add the comment to the post
                              handleAddComment(post.id, comment);
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAccordionChange(post.id)}
                  aria-expanded={expandedPost === post.id}
                  aria-controls={`post-content-${post.id}`}
                >
                  {expandedPost === post.id ? "Hide Article" : "Read Article"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-muted/30 rounded-lg p-6 border">
          <NewsletterSignup 
            className="shadow-none border-none" 
            title="Stay Updated on Digital Wellness" 
            description="Subscribe to our newsletter for the latest articles, tips, and updates on digital wellness and online safety for you and your family."
          />
        </div>
      </div>
    </div>
  );
}
