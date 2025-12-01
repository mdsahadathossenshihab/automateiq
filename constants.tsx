import React from 'react';
import { MessageCircle, Facebook, Youtube, MessageSquare, Instagram, Database } from 'lucide-react';
import { Service, PricingPackage, ServiceDetailContent } from './types';

// PERMANENT META PIXEL ID - DO NOT DELETE OR CHANGE WITHOUT REQUEST
export const META_PIXEL_ID = "1527790078500370";

// Updated: Louder "Ding" Sound (Base64) for reliable playback
export const NOTIFICATION_SOUND_BASE64 = "data:audio/mpeg;base64,SUQzBAAAAAABAFRYWFQAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhUAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhUAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyAFRTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

// Centralized Contact Information
export const CONTACT_INFO = {
  phone: '+880 1624-819585',
  whatsapp: '8801624819585', // Format for API link
  paymentNumber: '01842-369496',
  email: 'info@automateiq.xyz',
  facebookPage: 'https://web.facebook.com/automateiq.xyz',
  youtubeChannel: 'https://www.youtube.com/@AutoMateIQ', // Placeholder, update if you have one
  address: 'Dhaka, Bangladesh'
};

export const SERVICES: Service[] = [
  {
    id: 'messenger',
    title: 'মেসেঞ্জার চ্যাটবট',
    description: 'আপনার ফেসবুক পেজের জন্য ২৪/৭ অটোমেটেড কাস্টমার সাপোর্ট এবং লিড জেনারেশন।',
    icon: <MessageCircle className="w-12 h-12 text-blue-600" />,
  },
  {
    id: 'instagram',
    title: 'ইনস্টাগ্রাম চ্যাটবট',
    description: 'ইনস্টাগ্রাম ডিএম এবং স্টোরি রিপ্লাই অটোমেশন। বিজনেস গ্রোথ এবং এনগেজমেন্ট বৃদ্ধি।',
    icon: <Instagram className="w-12 h-12 text-pink-600" />,
  },
  {
    id: 'whatsapp',
    title: 'হোয়াটসঅ্যাপ চ্যাটবট',
    description: 'বাল্ক মেসেজিং এবং অটো রিপ্লাই এর মাধ্যমে কাস্টমারদের সাথে সরাসরি যোগাযোগ।',
    icon: <MessageSquare className="w-12 h-12 text-green-500" />,
  },
  {
    id: 'fb-post',
    title: 'ফেসবুক অটো পোস্ট',
    description: 'শিডিউল অনুযায়ী আপনার পেজ এবং গ্রুপে অটোমেটিক পোস্ট পাবলিশ করুন।',
    icon: <Facebook className="w-12 h-12 text-blue-700" />,
  },
  {
    id: 'yt-post',
    title: 'ইউটিউব অটো পোস্ট',
    description: 'নতুন ভিডিও আপলোড এবং কমিউনিটি পোস্ট ম্যানেজমেন্ট অটোমেশন।',
    icon: <Youtube className="w-12 h-12 text-red-600" />,
  },
];

// Main Subscription Packages
export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'messenger-pkg',
    serviceName: 'মেসেঞ্জার চ্যাটবট',
    description: 'স্মার্ট AI রিপ্লাই ও অর্ডার ম্যানেজমেন্ট',
    monthlyPrice: '৳৫০ - ৳১,০০০',
    oneTimePrice: '৳৫,০০০',
    features: [
      '২৪/৭ অটো রিপ্লাই (টেক্সট/ইমেজ)',
      'এক্সটার্নাল ড্যাশবোর্ড অ্যাক্সেস',
      'API ইন্টিগ্রেশন সাপোর্ট',
      'অটোমেটেড অর্ডার টেকিং',
      'এককালীন প্যাকেজেও ৫০০ টাকা ফ্রি ক্রেডিট',
      'প্রিমিয়ামে ভয়েস মেসেজ সাপোর্ট'
    ],
    recommended: true,
    monthlyVariants: [
      { name: 'ট্রায়াল (৭ দিন - ৫০ টাকা ক্রেডিট)', price: '৳৫০' },
      { name: 'স্ট্যান্ডার্ড (৫০০ টাকা ফ্রি ক্রেডিট)', price: '৳৭০০' },
      { name: 'প্রিমিয়াম (৫০০ টাকা ফ্রি ক্রেডিট + ভয়েস)', price: '৳১,০০০' }
    ]
  },
  {
    id: 'instagram-pkg',
    serviceName: 'ইনস্টাগ্রাম চ্যাটবট',
    description: 'ডিএম ও স্টোরি রিপ্লাই অটোমেশন',
    monthlyPrice: '৳৫০ - ৳১,০০০',
    oneTimePrice: '৳৫,০০০',
    features: [
      'প্রফেশনাল ড্যাশবোর্ড',
      'অটোমেটেড ডিএম রিপ্লাই',
      'স্টোরি মেনশন রিপ্লাই',
      'কুইক রিপ্লাই বাটন',
      'লিড কালেকশন'
    ],
    monthlyVariants: [
      { name: 'ট্রায়াল (৭ দিন)', price: '৳৫০' },
      { name: 'স্ট্যান্ডার্ড (টেক্সট + ইমেজ)', price: '৳৭০০' },
      { name: 'প্রিমিয়াম (সব ফিচার)', price: '৳১,০০০' }
    ]
  },
  {
    id: 'whatsapp-pkg',
    serviceName: 'হোয়াটসঅ্যাপ বিজনেস বট',
    description: 'অফিসিয়াল API এবং অটোমেশন সলিউশন',
    monthlyPrice: '৳৫০ - $৭', 
    oneTimePrice: '৳৫,০০০',
    features: [
      'অফিসিয়াল Cloud API সেটআপ',
      '১ম মাসের প্ল্যাটফর্ম চার্জ ফ্রি',
      'পরবর্তীতে মাত্র $৭/মাস (API চার্জ)',
      'বিজনেস ভেরিফিকেশন সাপোর্ট',
      'আনলিমিটেড ব্রডকাস্ট'
    ],
    monthlyVariants: [
      { name: 'ট্রায়াল (৭ দিন)', price: '৳৫০' },
      { name: 'স্ট্যান্ডার্ড সেটআপ', price: '৳১,৫০০' }
    ]
  },
  {
    id: 'fb-post-pkg',
    serviceName: 'ফেসবুক অটো পোস্ট',
    description: 'পেজ ও গ্রুপ শিডিউলিং অটোমেশন',
    monthlyPrice: '৳৫০ - ৳১,০০০',
    oneTimePrice: '৳৫,০০০',
    features: [
      'আনলিমিটেড শিডিউলিং',
      'মাল্টি-পেজ ম্যানেজমেন্ট',
      'ইমেজ ও ভিডিও সাপোর্ট',
      'এনালিটিক্স রিপোর্ট',
      'বাল্ক আপলোড'
    ],
    monthlyVariants: [
      { name: 'ট্রায়াল (৭ দিন)', price: '৳৫০' },
      { name: 'মাসিক প্যাকেজ', price: '৳১,০০০' }
    ]
  },
  {
    id: 'yt-pkg',
    serviceName: 'ইউটিউব অটো পোস্ট',
    description: 'ভিডিও আপলোড ও শিডিউলিং অটোমেশন',
    monthlyPrice: '৳৫০ - ৳১,০০০',
    oneTimePrice: '৳৫,০০০',
    features: [
      'অটো ভিডিও পাবলিশ',
      'ট্যাগ জেনারেশন ও এসইও',
      'ডেসক্রিপশন অপটিমাইজেশন',
      'কমিউনিটি পোস্ট শিডিউলিং',
      'কমেন্ট মনিটরিং'
    ],
    monthlyVariants: [
      { name: 'ট্রায়াল (৭ দিন)', price: '৳৫০' },
      { name: 'মাসিক প্যাকেজ', price: '৳১,০০০' }
    ]
  },
];

// Separate API Top-up Package Base Template
export const API_TOPUP_PACKAGE: PricingPackage = {
  id: 'api-topup',
  serviceName: 'API ক্রেডিট রিচার্জ',
  description: 'চ্যাটবটের জন্য অতিরিক্ত ব্যালেন্স কিনুন',
  monthlyPrice: '৳২০০+',
  oneTimePrice: 'CUSTOM', // Placeholder
  hideMonthlyOption: true,
  features: [
    'ইনস্ট্যান্ট রিচার্জ',
    'মেয়াদহীন (No Expiry)',
    'যেকোনো প্যাকেজের সাথে ব্যবহারযোগ্য',
    'সহজ পেমেন্ট',
    'ব্যালেন্স শেষ হলে বট কাজ করবে না'
  ]
  // monthlyVariants Removed to support custom input
};

const MESSENGER_DETAILS: ServiceDetailContent = {
  id: 'messenger-pkg',
  title: 'মেসেঞ্জার চ্যাটবট - সম্পূর্ণ খরচ ও বিবরণ',
  subtitle: 'AI চালিত স্মার্ট রিপ্লাই সিস্টেম যা আপনার কাস্টমার সার্ভিস খরচ কমাবে',
  howItWorks: [
    {
      title: '১. অর্ডার ও সেটআপ',
      desc: 'আপনি প্যাকেজ সিলেক্ট করে অর্ডার করবেন। আমরা আপনার পেজের সাথে আমাদের সিস্টেম কানেক্ট করে দিব। ট্রায়ালের জন্য ৫০ টাকা এবং মাসিক প্যাকেজের জন্য ৭০০/১০০০ টাকা প্রযোজ্য।'
    },
    {
      title: '২. API ক্রেডিট ও খরচ',
      desc: 'মাসিক প্যাকেজে আপনি ৫০০ টাকার API ক্রেডিট ফ্রি পাবেন। প্রতি ১০০০ শব্দ বা টোকেনের জন্য নামমাত্র চার্জ কাটা হবে। ফ্রি ক্রেডিট শেষ হলে আপনি টপ-আপ করতে পারবেন।'
    },
    {
      title: '৩. ড্যাশবোর্ড কন্ট্রোল',
      desc: 'আপনাকে একটি এক্সটার্নাল ড্যাশবোর্ড দেওয়া হবে যেখান থেকে আপনি চ্যাট হিস্টোরি দেখতে পারবেন, হিউম্যান এজেন্ট মোড অন করতে পারবেন এবং ব্যালেন্স চেক করতে পারবেন।'
    }
  ],
  benefits: [
    '২৪/৭ কাস্টমার সাপোর্ট নিশ্চিত করে',
    'মানুষের চেয়ে দ্রুত রিপ্লাই',
    'একসাথে হাজার হাজার কাস্টমার হ্যান্ডেল করার ক্ষমতা',
    '৫০০ টাকা মাসিক ফ্রি ক্রেডিট (পর্যাপ্ত সাধারণ ব্যবহারের জন্য)'
  ],
  techSpecs: [
    'সাবস্ক্রিপশন ফি: ৭০০ টাকা / ১০০০ টাকা (মাসিক)',
    'এপিআই খরচ: ব্যবহারের উপর ভিত্তি করে (Pay As You Go)',
    'ফ্রি ক্রেডিট: ৫০০ টাকা / মাস',
    'ভয়েস সাপোর্ট: শুধুমাত্র প্রিমিয়াম প্যাকেজে'
  ]
};

const INSTAGRAM_DETAILS: ServiceDetailContent = {
  id: 'instagram-pkg',
  title: 'ইনস্টাগ্রাম অটোমেশন - খরচ ও বিবরণ',
  subtitle: 'ইনস্টাগ্রাম গ্রোথ এবং এনগেজমেন্ট বাড়ানোর সেরা উপায়',
  howItWorks: [
    {
      title: '১. কানেকশন',
      desc: 'আপনার ইনস্টাগ্রাম বিজনেস একাউন্টটি আমাদের সিস্টেমের সাথে যুক্ত করা হবে।'
    },
    {
      title: '২. অটোমেশন সেটআপ',
      desc: 'স্টোরি রিপ্লাই, ডিএম রিপ্লাই এবং কি-ওয়ার্ড ভিত্তিক অটোমেশন রুল সেট করা হবে।'
    },
    {
      title: '৩. খরচ',
      desc: 'এটি একটি ফিক্সড মাসিক প্যাকেজ। ৭০০ বা ১০০০ টাকা ফিক্সড চার্জ। এর বাইরে কোনো গোপন খরচ নেই।'
    }
  ],
  benefits: [
    'স্টোরি মেনশনে অটো ধন্যিবাদ',
    'লিড বা কাস্টমার ডাটা কালেকশন',
    'সময় সাশ্রয় ও দ্রুত রেসপন্স'
  ],
  techSpecs: [
    'মাসিক চার্জ: ৭০০ টাকা / ১০০০ টাকা',
    'কোনো অতিরিক্ত API খরচ নেই',
    'আনলিমিটেড রিপ্লাই'
  ]
};

const WHATSAPP_DETAILS: ServiceDetailContent = {
  id: 'whatsapp-pkg',
  title: 'অফিসিয়াল হোয়াটসঅ্যাপ বিজনেস API - বিস্তারিত',
  subtitle: 'মেটা (Facebook) এর অফিসিয়াল সলিউশন দিয়ে কাস্টমারদের সাথে বিশ্বাসযোগ্য যোগাযোগ স্থাপন করুন',
  howItWorks: [
    {
      title: '১. ডকুমেন্ট সাবমিশন ও ভেরিফিকেশন',
      desc: 'অর্ডার করার পর আপনার ট্রেড লাইসেন্স বা বিজনেস ডকুমেন্ট আমাদের দিবেন। আমরা মেটার কাছে আপনার বিজনেসের ভেরিফিকেশনের জন্য আবেদন করব।'
    },
    {
      title: '২. API সেটআপ ও ইন্টিগ্রেশন',
      desc: 'মাত্র ১,৫০০ টাকায় (এককালীন) আমরা সম্পূর্ণ ক্লাউড API সেটআপ করে দিব। ১ম মাস কোনো প্ল্যাটফর্ম ফি লাগবে না।'
    },
    {
      title: '৩. মেসেজিং ও ব্রডকাস্ট',
      desc: 'সেটআপ শেষে আপনি হাজার হাজার কাস্টমারকে অফার পাঠাতে পারবেন। প্রতি ২৪ ঘন্টার সেশনের জন্য মেটা নির্ধারিত চার্জ প্রযোজ্য হবে যা আপনার ওয়ালেট থেকে কাটা হবে।'
    }
  ],
  benefits: [
    'ব্যান হওয়ার কোনো ভয় নেই (১০০% অফিসিয়াল)',
    'নামের পাশে গ্রিন টিক (Green Tick) পাওয়ার সুযোগ',
    'আনলিমিটেড বাল্ক মেসেজিং সুবিধা',
    '১ম মাসের প্ল্যাটফর্ম সাবস্ক্রিপশন সম্পূর্ণ ফ্রি'
  ],
  techSpecs: [
    'সেটআপ চার্জ: ১,৫০০ টাকা (এককালীন)',
    'মাসিক প্ল্যাটফর্ম ফি: $৭ (২য় মাস থেকে)',
    'মেসেজ খরচ: মেটা নির্ধারিত লোকাল রেট অনুযায়ী'
  ]
};

const FB_POST_DETAILS: ServiceDetailContent = {
  id: 'fb-post-pkg',
  title: 'ফেসবুক অটো পোস্টিং - বিস্তারিত',
  subtitle: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট এখন অটোমেটেড',
  howItWorks: [
    {
      title: '১. কন্টেন্ট প্ল্যানিং',
      desc: 'আপনি পুরো মাসের পোস্ট, ছবি বা ভিডিও একদিনে আপলোড করে শিডিউল করে রাখতে পারবেন।'
    },
    {
      title: '২. অটো পাবলিশ',
      desc: 'আপনার ঠিক করা সময়ে সিস্টেম অটোমেটিক পোস্ট পাবলিশ করবে। আপনাকে অনলাইনে থাকতে হবে না।'
    },
    {
      title: '৩. খরচ',
      desc: 'মাসিক ১,০০০ টাকা ফিক্সড চার্জ। এককালীন ৫,০০০ টাকা লাইফটাইম সেটআপ। আনলিমিটেড পেজ ও গ্রুপ কানেক্ট করা যাবে।'
    }
  ],
  benefits: [
    'নিয়মিত পোস্ট এনগেজমেন্ট বাড়ায়',
    'একসাথে অনেক গ্রুপে পোস্টিং',
    'সময় বাঁচায়'
  ],
  techSpecs: [
    'মাসিক চার্জ: ১,০০০ টাকা',
    'এককালীন সেটআপ: ৫,০০০ টাকা',
    'আনলিমিটেড পোস্ট',
    'মাল্টি-পেজ সাপোর্ট'
  ]
};

const YT_POST_DETAILS: ServiceDetailContent = {
  id: 'yt-pkg',
  title: 'ইউটিউব অটো পোস্টিং - বিস্তারিত',
  subtitle: 'চ্যানেল গ্রোথ এবং ভিডিও আপলোড অটোমেশন',
  howItWorks: [
    {
      title: '১. ভিডিও অপটিমাইজেশন',
      desc: 'ভিডিও আপলোডের সময় আমাদের টুল অটোমেটিক সেরা টাইটেল, ট্যাগ এবং ডেসক্রিপশন জেনারেট করে দিবে।'
    },
    {
      title: '২. অটো পাবলিশ',
      desc: 'শিডিউল অনুযায়ী ভিডিও অটোমেটিক পাবলিশ হবে এবং সোশ্যাল মিডিয়ায় শেয়ার হবে।'
    },
    {
      title: '৩. খরচ',
      desc: 'মাসিক ১,০০০ টাকা ফিক্সড চার্জ। এককালীন ৫,০০০ টাকা লাইফটাইম সেটআপ।'
    }
  ],
  benefits: [
    'ভিডিও র‍্যাংকিং ইমপ্রুভমেন্ট',
    'সময় মতো ভিডিও পাবলিশ',
    'অর্গানিক ভিউ বৃদ্ধি'
  ],
  techSpecs: [
    'মাসিক চার্জ: ১,০০০ টাকা',
    'এককালীন সেটআপ: ৫,০০০ টাকা',
    'ভিডিও এসইও সাপোর্ট'
  ]
};

const API_TOPUP_DETAILS: ServiceDetailContent = {
  id: 'api-topup',
  title: 'API ক্রেডিট রিচার্জ - বিস্তারিত',
  subtitle: 'আপনার চ্যাটবটের নিরবচ্ছিন্ন সেবার জন্য ব্যালেন্স',
  howItWorks: [
    {
      title: '১. পরিমাণ লিখুন',
      desc: 'বক্সে আপনার প্রয়োজনীয় টাকার পরিমাণ লিখুন (মিনিমাম ২০০ টাকা)।'
    },
    {
      title: '২. অর্ডার ও পেমেন্ট',
      desc: 'বিকাশ বা নগদে পেমেন্ট করে ট্রানজেকশন আইডি সাবমিট করুন।'
    },
    {
      title: '৩. ব্যালেন্স আপডেট',
      desc: 'পেমেন্ট ভেরিফিকেশনের পর আপনার ওয়ালেটে ব্যালেন্স যুক্ত হবে।'
    }
  ],
  benefits: [
    'মিনিমাম ২০০ টাকা থেকে শুরু',
    'কোনো মেয়াদ নেই (No Expiry)',
    'রাউন্ড ফিগার রিচার্জ সুবিধা'
  ],
  techSpecs: [
    'মিনিমাম রিচার্জ: ২০০ টাকা',
    'মাল্টিপল: ১০ টাকার গুণিতক (যেমন ২১০, ৫৫০)',
    'পেমেন্ট মেথড: বিকাশ/নগদ'
  ]
};

// Map both Package IDs and Generic Service IDs to content
export const SERVICE_DETAILS: Record<string, ServiceDetailContent> = {
  'messenger-pkg': MESSENGER_DETAILS,
  'messenger': MESSENGER_DETAILS,
  
  'instagram-pkg': INSTAGRAM_DETAILS,
  'instagram': INSTAGRAM_DETAILS,
  
  'whatsapp-pkg': WHATSAPP_DETAILS,
  'whatsapp': WHATSAPP_DETAILS,
  
  'fb-post-pkg': FB_POST_DETAILS,
  'fb-post': FB_POST_DETAILS,
  
  'yt-pkg': YT_POST_DETAILS,
  'yt-post': YT_POST_DETAILS,
  
  'api-topup': API_TOPUP_DETAILS,
  
  'default': {
    id: 'generic',
    title: 'অটোমেশন সার্ভিস বিস্তারিত',
    subtitle: 'কিভাবে আমরা আপনার কাজ সহজ করে দিই',
    howItWorks: [
      { title: 'রিকোয়ারমেন্ট অ্যানালাইসিস', desc: 'আমরা আপনার বিজনেসের প্রয়োজন বুঝি।' },
      { title: 'সিস্টেম সেটআপ', desc: 'API এবং সফটওয়্যার কনফিগারেশন করা হয়।' },
      { title: 'ডেলিভারি', desc: 'টেস্টিং শেষে বুঝিয়ে দেওয়া হয়।' }
    ],
    benefits: [
      'সময় ও খরচ সাশ্রয়',
      'নির্ভুল কাজ',
      'প্রফেশনাল সাপোর্ট'
    ]
  }
};

export const SYSTEM_INSTRUCTION = `
You are a helpful, professional AI assistant for "AutoMateIQ", a bangladeshi automation agency.
We offer specific packages: Messenger Chatbot, Instagram Chatbot, WhatsApp Chatbot, Facebook Auto Post, and YouTube Auto Post.

IMPORTANT:
- If a user asks to talk to a human, agent, or support, politely give them this WhatsApp link: https://wa.me/${CONTACT_INFO.whatsapp}
- Answer questions politely in Bengali.

PRICING MODEL:
1. Messenger Chatbot:
   - Trial: 50 BDT (7 Days, 50 BDT Credit).
   - Standard: 700 BDT/month (Includes 500 BDT API Credit).
   - Premium: 1000 BDT/month (Includes 500 BDT API Credit).
   - One-Time: 5000 BDT (Includes 500 BDT Free API Credit).
   - Only this package includes External Dashboard.

2. API Credit Top-up:
   - Starts from 200 BDT.
   - User can top-up custom amounts (multiples of 10).

3. Instagram & WhatsApp:
   - Trial: 50 BDT (7 Days).
   - Standard monthly rates apply.
   - NO Dashboard for these.

4. Facebook & YouTube Auto Post:
   - Trial: 50 BDT (7 Days).
   - Monthly: 1000 BDT.
   - One-Time: 5000 BDT.

5. WhatsApp Chatbot:
   - One-Time Setup: 1,500 BDT.
   - Platform Charge: $7/month (1st month free).
`;