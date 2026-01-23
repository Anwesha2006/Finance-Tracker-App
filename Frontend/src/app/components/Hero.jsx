export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
                <span className="text-accent">Financial</span> Intelligence,
                <br />
                Simplified
              </h2>
              <p className="text-xl text-muted-foreground max-w-lg">
                A conversational financial assistant that transforms how you
                understand your money. Ask questions naturally, get visual
                insights instantly.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
              <button className="px-6 py-3 rounded-lg border border-accent text-accent font-medium hover:bg-accent/10 transition-colors">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              <div>
                <p className="text-2xl font-bold text-accent">100%</p>
                <p className="text-sm text-muted-foreground">
                  Private & Secure
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">AI-Powered</p>
                <p className="text-sm text-muted-foreground">
                  Smart Analysis
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">Real-time</p>
                <p className="text-sm text-muted-foreground">Insights</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-3xl blur-3xl" />
            <div className="relative bg-card border-2 border-accent rounded-2xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-accent">Your Balance</h3>
                  <span className="text-2xl text-accent font-bold">
                    $4,018.4K
                  </span>
                </div>

                <div className="h-24 bg-muted rounded-lg flex items-end justify-around p-4">
                  <div className="w-1 h-1/3 bg-accent rounded-full" />
                  <div className="w-1 h-2/3 bg-accent rounded-full" />
                  <div className="w-1 h-1/2 bg-accent rounded-full" />
                  <div className="w-1 h-3/4 bg-accent rounded-full" />
                  <div className="w-1 h-2/3 bg-accent rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Spending</p>
                    <p className="font-bold text-accent">+$2,340</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Savings</p>
                    <p className="font-bold text-accent">+$1,678</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
