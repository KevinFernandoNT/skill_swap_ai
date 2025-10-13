import React, { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowRight, CreditCard, Shield, Users, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  buttonText: string;
  buttonVariant: 'default' | 'outline' | 'secondary';
}

const SubscriptionPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started with skill exchange',
      icon: <Users className="w-6 h-6" />,
      color: 'text-gray-600',
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      features: [
        'Up to 3 skill exchanges',
        '5 session suggessions',
        'Community access',
        'Basic search and discovery',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 15,
      period: 'month',
      description: 'For serious learners and skill sharers',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-blue-600',
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      popular: true,
      features: [
        'Unlimited skill exchanges',
        'Unlimited Sessions',
        'Unlimited Exchange Requests',
        'Unlimited user connections',
        'Full access to progress tracking & analytics',
        'More suggested sessions'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (plan: Plan) => {
    if (plan.id === 'free') {
      toast({
        title: "Already on Free Plan",
        description: "You're currently using the free plan.",
      });
      return;
    }

    toast({
      title: "Redirecting to Payment",
      description: `Redirecting to payment for ${plan.name} plan...`,
    });
    
    // TODO: Implement actual payment integration
    console.log(`Subscribing to ${plan.name} plan for $${plan.price}/${plan.period}`);
  };

  const getPlanCardStyles = (plan: Plan) => {
    const baseStyles = "relative transition-all duration-300 hover:shadow-lg";
    
    if (plan.popular) {
      return `${baseStyles} ring-2 ring-primary shadow-lg scale-105`;
    }
    
    if (selectedPlan === plan.id) {
      return `${baseStyles} ring-2 ring-primary`;
    }
    
    return `${baseStyles} hover:ring-1 hover:ring-border`;
  };

  return (
    <motion.div 
      className="bg-background min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="px-4 py-12 lg:px-8 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose Your Learning Journey
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Unlock your potential with our flexible subscription plans. 
            Start free and upgrade as you grow.
          </motion.p>
          
          {/* Current Plan Status */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Currently on Free Plan
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div 
        className="px-4 py-8 lg:px-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className="w-full max-w-sm"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`${getPlanCardStyles(plan)} h-full flex flex-col`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 ${plan.color}`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0 flex flex-col flex-1">
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full mt-auto"
                    variant={plan.buttonVariant}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(plan);
                    }}
                    disabled={plan.id === 'free'}
                  >
                    {plan.buttonText}
                    {plan.id !== 'free' && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Comparison */}
      <motion.div 
        className="px-4 py-16 lg:px-8 bg-muted/30"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Compare All Features
            </h2>
            <p className="text-muted-foreground">
              See what's included in each plan
            </p>
          </motion.div>
          
          <motion.div 
            className="overflow-x-auto"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Skill Exchanges', free: '3', pro: 'Unlimited' },
                  { feature: 'Session Suggestions', free: '5', pro: 'More' },
                  { feature: 'Sessions', free: 'Limited', pro: 'Unlimited' },
                  { feature: 'Exchange Requests', free: 'Limited', pro: 'Unlimited' },
                  { feature: 'User Connections', free: 'Limited', pro: 'Unlimited' },
                  { feature: 'Progress Tracking & Analytics', free: 'Basic', pro: 'Full Access' },
                ].map((row, index) => (
                  <motion.tr 
                    key={index} 
                    className="border-b border-border/50"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                  >
                    <td className="py-4 px-6 text-foreground font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-muted-foreground">{row.free}</td>
                    <td className="py-4 px-6 text-center text-muted-foreground">{row.pro}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        className="px-4 py-16 lg:px-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our subscription plans
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual subscriptions."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-3 text-sm">{faq.question}</h3>
                  <p className="text-muted-foreground text-xs">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="px-4 py-16 lg:px-8 bg-primary/5"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold text-foreground mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            Ready to Accelerate Your Learning?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            Join thousands of learners who are already using SkillSwap AI to reach their goals.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.9 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" onClick={() => handleSubscribe(plans[1])}>
                <Zap className="w-5 h-5 mr-2" />
                Start Pro Trial
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionPage;
