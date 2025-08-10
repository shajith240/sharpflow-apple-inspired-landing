'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export default function FAQSection() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How quickly can I get my voice agent set up?',
            answer: 'Most voice agents can be set up within 24-48 hours after our initial consultation. This includes custom workflow creation, voice training, and website integration. Complex integrations may take 3-5 business days.',
        },
        {
            id: 'item-2',
            question: 'What makes SharpFlow different from other voice AI solutions?',
            answer: 'SharpFlow uses ElevenLabs\' industry-leading voice technology combined with our custom workflow automation. We provide human-like conversations, seamless appointment booking, and detailed analytics - all with a one-time setup fee and transparent monthly pricing.',
        },
        {
            id: 'item-3',
            question: 'Can the voice agent handle complex customer inquiries?',
            answer: 'Yes! Our voice agents are trained on your specific business needs and can handle complex workflows including appointment scheduling, product inquiries, lead qualification, and customer support. They can also seamlessly transfer to human agents when needed.',
        },
        {
            id: 'item-4',
            question: 'How does the pricing work?',
            answer: 'We offer three transparent plans: Starter ($89/month), Professional ($159/month), and Enterprise ($449/month). All plans include a one-time $249 setup fee and provide different amounts of voice interaction minutes. You can upgrade or downgrade at any time.',
        },
        {
            id: 'item-5',
            question: 'What kind of analytics and reporting do you provide?',
            answer: 'All plans include detailed analytics showing conversation metrics, appointment bookings, customer satisfaction, and interaction patterns. Professional and Enterprise plans offer real-time dashboards and advanced reporting features.',
        },
        {
            id: 'item-6',
            question: 'Can I customize the voice and personality of my agent?',
            answer: 'Absolutely! Professional and Enterprise plans include custom voice training and personality customization. You can choose from various voice options and define conversation styles that match your brand personality.',
        },
    ]

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-surface-subtle">
            <div className="container-padding">
                <ScrollReveal className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-primary">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground mt-4 text-balance text-body">
                        Get answers to common questions about SharpFlow's voice automation platform and how it can transform your business.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.2} className="mx-auto mt-12 max-w-3xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-6 shadow-lg ring-4 dark:ring-0"
                    >
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed border-border"
                            >
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline text-left font-semibold text-primary">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base text-text-secondary leading-relaxed">
                                        {item.answer}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollReveal>

                <ScrollReveal delay={0.4} className="mt-8 text-center">
                    <p className="text-muted-foreground text-body">
                        Still have questions?{' '}
                        <a
                            href="#contact"
                            className="text-accent font-medium hover:underline transition-colors"
                        >
                            Contact our team
                        </a>{' '}
                        for a free consultation.
                    </p>
                </ScrollReveal>
            </div>
        </section>
    )
}