import {
  createSignal,
  createResource,
  For,
  type Component,
  createMemo,
  Show,
} from "solid-js";
import { Skeleton } from "../ui/Skeleton";
import MetaTitle from "../components/metaTitle";

declare let fx: any;

export const fetchDonations = async () => {
  try {
    const response = await fetch("https://api.asraye.com/donations");
    if (!response.ok) throw new Error("Backend unreachable");

    const data = await response.json();
    if (data && data.donations) {
      data.donations.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return data;
  } catch (e) {
    console.error("Support Page Error:", e);
    return null;
  }
};

const Support: Component = () => {
  const [data] = createResource(fetchDonations);
  const [amount, setAmount] = createSignal("10");
  const [currency, setCurrency] = createSignal("USD");
  const [donorName, setDonorName] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [isAnonymous, setIsAnonymous] = createSignal(false);

  const shopUrl = "https://asraye-shop.fourthwall.com";
  const expenses = [
    { label: "VPS Hosting", cost: 15.39, category: "Hosting" },
  ];

  fx.base = "USD";
  fx.rates = {
    USD: 1.0,
    AUD: 1.55,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    JPY: 143.2,
    NZD: 1.68,
    CHF: 0.88,
    SGD: 1.34,
    HKD: 7.82,
    SEK: 10.55,
    NOK: 10.72,
    INR: 83.12,
    BRL: 4.95,
    ZAR: 18.9,
  };

  const formatValue = (val: number, code: string) => {
    const symbol = code === "AUD" ? "A$" : code === "USD" ? "$" : "";
    if (symbol) return `${symbol}${Math.floor(val).toLocaleString()}`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCheckout = () => {
    const val = amount() || "10";
    const cur = currency();
    const donor = isAnonymous()
      ? "Anonymous"
      : encodeURIComponent(donorName() || "Anonymous");
    const msg = encodeURIComponent(message());

    const checkoutUrl = `${shopUrl}/donation/?donor=${donor}&message=${msg}&amount-radio=${val}.00&donationOpts%5B%5D=5.00&donationOpts%5B%5D=10.00&donationOpts%5B%5D=15.00&donationOpts%5B%5D=20.00&amount-custom=&amount=${val}&currency=${cur}`;

    window.location.href = checkoutUrl;
  };

  const stats = createMemo(() => {
    const res = data();
    const curCode = currency();
    const now = new Date();

    const totalExpensesUsd = expenses.reduce((sum, item) => sum + item.cost, 0);

    if (!res)
      return {
        monthly: 0,
        goal: fx.convert(totalExpensesUsd, { from: "USD", to: curCode }),
        percent: 0,
        topName: "---",
        topVal: 0,
        balance: 0,
      };

    let monthlyTotalUsd = 0;
    res.donations.forEach((don: any) => {
      const d = new Date(don.createdAt);
      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        monthlyTotalUsd += don.amounts.total.value;
      }
    });

    const convertedGoal = fx.convert(totalExpensesUsd, {
      from: "USD",
      to: curCode,
    });
    const convertedMonthly = fx.convert(monthlyTotalUsd, {
      from: "USD",
      to: curCode,
    });

    return {
      monthly: convertedMonthly,
      goal: convertedGoal,
      percent: Math.min((monthlyTotalUsd / totalExpensesUsd) * 100, 100),
      topName: res.top_supporter_name,
      topVal: fx.convert(res.top_supporter_value, { from: "USD", to: curCode }),
      balance: convertedMonthly - convertedGoal,
    };
  });

  return (
    <div class="min-h-screen flex flex-col bg-[#0B0B12] text-white selection:bg-[#6A00FF]/30">
      <div class="max-w-6xl mx-auto px-6 w-full pt-16 md:pt-32 pb-24">
        <header class="mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div class="w-full">
            <a
              href="/"
              class="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7A7A90] hover:text-[#6A00FF] transition-all no-underline"
            >
              ← Return
            </a>
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter mt-4 mb-2 italic uppercase">
              Support<span class="text-[#6A00FF]">.</span>
            </h1>
          </div>
          <MetaTitle title="Asraye | Support" />
          <div class="w-full md:w-72 group">
            <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A7A90] mb-2 block group-focus-within:text-[#6A00FF] transition-colors">
              Currency
            </label>
            <select
              value={currency()}
              onChange={(e) => setCurrency(e.currentTarget.value)}
              class="bg-[#12121A] border border-[#2A2A3A] text-sm font-bold p-4 rounded-2xl w-full outline-none focus:border-[#6A00FF] transition-all appearance-none cursor-pointer"
            >
              {Object.keys(fx.rates).map((code) => (
                <option value={code}>{code}</option>
              ))}
            </select>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
          <Show
            when={!data.loading}
            fallback={
              <>
                <Skeleton.Item height="140px" class="rounded-[2.5rem]" />
                <Skeleton.Item height="140px" class="rounded-[2.5rem]" />
              </>
            }
          >
            <div class="p-8 md:p-10 rounded-[2.5rem] bg-[#12121A] border border-[#2A2A3A]">
              <div class="flex justify-between items-end mb-6">
                <div>
                  <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6A00FF]">
                    Monthly Goal
                  </h3>
                  <div class="text-xs text-[#7A7A90] font-bold mt-1">
                    Target: {formatValue(stats().goal, currency())}
                  </div>
                </div>
                <span class="text-lg font-mono font-bold">
                  {formatValue(stats().monthly, currency())}
                </span>
              </div>
              <div class="w-full h-2.5 bg-[#0B0B12] rounded-full overflow-hidden border border-white/5">
                <div
                  class="h-full bg-[#6A00FF] transition-all duration-1000"
                  style={`width: ${stats().percent}%`}
                />
              </div>
            </div>

            <div class="p-8 md:p-10 rounded-[2.5rem] bg-[#12121A] border border-[#2A2A3A] flex items-center justify-between">
              <div>
                <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A7A90]">
                  Top Supporter
                </h3>
                <span class="text-2xl md:text-3xl font-black uppercase tracking-tight line-clamp-1">
                  {stats().topName}
                </span>
              </div>
              <div class="text-3xl md:text-4xl font-mono font-black text-[#6A00FF] pl-4">
                {formatValue(stats().topVal, currency())}
              </div>
            </div>
          </Show>
        </div>

        <div class="flex flex-col-reverse lg:grid lg:grid-cols-5 gap-12 md:gap-16">
          <section class="lg:col-span-3 space-y-12">
            <div>
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-[10px] uppercase tracking-[0.4em] font-black text-[#6A00FF]">
                  Expenses
                </h2>
                <div
                  class={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
                    stats().balance >= 0
                      ? "bg-green-500/10 border-green-500/50 text-green-400"
                      : "bg-red-500/10 border-red-500/50 text-red-400"
                  }`}
                >
                  {stats().balance >= 0 ? "Surplus" : "Deficit"}{" "}
                  {formatValue(Math.abs(stats().balance), currency())}
                </div>
              </div>
              <div class="space-y-3">
                {expenses.map((item) => (
                  <div class="flex items-center justify-between p-5 rounded-[1.8rem] bg-[#12121A]/40 border border-[#2A2A3A]">
                    <div class="flex flex-col">
                      <span class="text-[9px] font-bold uppercase text-[#7A7A90] tracking-widest">
                        {item.category}
                      </span>
                      <span class="font-bold text-sm">{item.label}</span>
                    </div>
                    <span class="font-mono text-sm font-bold text-[#7A7A90]">
                      -
                      {formatValue(
                        fx.convert(item.cost, { from: "USD", to: currency() }),
                        currency()
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 class="text-[10px] uppercase tracking-[0.4em] font-black text-[#6A00FF] mb-8">
                Activity
              </h2>
              <div class="space-y-3">
                <Show
                  when={!data.loading}
                  fallback={
                    <Skeleton.List count={3} class="w-full">
                      <Skeleton.Item
                        height="80px"
                        width="100%"
                        class="rounded-[1.8rem]"
                      />
                    </Skeleton.List>
                  }
                >
                  <For each={data()?.donations}>
                    {(don: any) => (
                      <div class="p-6 rounded-[1.8rem] bg-[#12121A]/40 border border-[#2A2A3A] flex justify-between items-center">
                        <div class="flex flex-col">
                          <span class="text-[9px] font-bold uppercase text-[#7A7A90] tracking-widest mb-1">
                            {new Date(don.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span class="text-sm font-black uppercase tracking-tight">
                            {don.username || "Anonymous"}
                          </span>
                        </div>
                        <span class="font-mono text-lg font-black text-white">
                          {formatValue(
                            fx.convert(don.amounts.total.value, {
                              from: "USD",
                              to: currency(),
                            }),
                            currency()
                          )}
                        </span>
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            </div>
          </section>

          <section class="lg:col-span-2">
            <div class="p-8 md:p-10 rounded-[2.5rem] bg-[#12121A] border border-[#2A2A3A] shadow-2xl lg:sticky lg:top-32">
              <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-40">
                Quick Support
              </h3>
              <div class="grid grid-cols-2 gap-2 md:gap-3 mb-6">
                {["5", "10", "15", "20"].map((val) => (
                  <button
                    onClick={() => setAmount(val)}
                    class={`py-4 md:py-5 rounded-2xl text-[10px] font-black border transition-all ${
                      amount() === val
                        ? "bg-[#6A00FF] border-[#6A00FF]"
                        : "bg-[#0B0B12] border-[#2A2A3A]"
                    }`}
                  >
                    {currency()} {val}
                  </button>
                ))}
              </div>

              <div class="space-y-4 mb-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A7A90] mb-2 block">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount()}
                      onInput={(e) => setAmount(e.currentTarget.value)}
                      class="w-full bg-[#0B0B12] border-2 border-[#2A2A3A] rounded-2xl py-4 px-6 text-lg text-white outline-none font-mono focus:border-[#6A00FF] transition-all"
                    />
                  </div>
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A7A90] block">
                        Name
                      </label>
                      <button
                        onClick={() => setIsAnonymous(!isAnonymous())}
                        class={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border transition-all ${
                          isAnonymous()
                            ? "bg-[#6A00FF] border-[#6A00FF] text-white"
                            : "bg-transparent border-[#2A2A3A] text-[#7A7A90]"
                        }`}
                      >
                        Anonymous
                      </button>
                    </div>
                    <input
                      type="text"
                      value={isAnonymous() ? "Anonymous" : donorName()}
                      disabled={isAnonymous()}
                      onInput={(e) => setDonorName(e.currentTarget.value)}
                      class={`w-full bg-[#0B0B12] border-2 rounded-2xl py-4 px-6 text-lg text-white outline-none font-medium transition-all ${
                        isAnonymous()
                          ? "border-[#6A00FF]/50 text-[#6A00FF] cursor-not-allowed"
                          : "border-[#2A2A3A] focus:border-[#6A00FF]"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A7A90] mb-2 block">
                    Message
                  </label>
                  <textarea
                    placeholder="Say something nice..."
                    value={message()}
                    onInput={(e) => setMessage(e.currentTarget.value)}
                    class="w-full bg-[#0B0B12] border-2 border-[#2A2A3A] rounded-2xl py-4 px-6 text-sm text-white outline-none font-medium focus:border-[#6A00FF] transition-all min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleCheckout}
                class="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-[#6A00FF] hover:text-white transition-all active:scale-[0.98]"
              >
                Complete Checkout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;
