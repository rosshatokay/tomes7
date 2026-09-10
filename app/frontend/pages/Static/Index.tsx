import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { ArrowRightIcon } from "lucide-react";
import gsap from "gsap"
import { SplitText } from "gsap/all";
import BaseLayout, { useReady } from "@/layouts/BaseLayout";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Book } from "@/interfaces/book";
import { BookCard } from "@/components/partials/cards/BookCard";
import { LinkUnderline } from "@/components/partials/LinkUnderline";

const hideSplitElms = (elm: Element, display: string) => {
	let wrapper = document.createElement("div")
	wrapper.classList.add('mask', '-my-2', 'py-2')
	wrapper.style.overflow = "hidden"
	wrapper.style.display = display

	elm?.parentNode?.insertBefore(wrapper, elm)
	wrapper.appendChild(elm)
}

function animatePage() {
	gsap.registerPlugin(SplitText)

	const tl = gsap.timeline()
	const titleSplit = SplitText.create('#splash-h1', { type: "lines" })
	const subtitleSplit = SplitText.create('#splash-p', { type: "lines" })
	const imageOpts: gsap.TweenVars = { duration: 1.5, yPercent: 12, opacity: 0, ease: "expo.out", scale: 0.9, transformOrigin: 'top center' }

	titleSplit.lines.forEach(line => hideSplitElms(line, 'inline-block'))
	subtitleSplit.lines.forEach(line => hideSplitElms(line, 'inline-block'))

	tl.from(titleSplit.lines, {
		duration: 1,
		yPercent: 110,
		stagger: 0.1,
		ease: "expo.out",
		force3D: false,
	}).from(subtitleSplit.lines, {
		duration: 1,
		yPercent: 200,
		stagger: 0.05,
		ease: "expo.out",
		force3D: false,
	}, '-=0.9').from('#splash-cta', {
		duration: 1,
		yPercent: 48,
		opacity: 0,
		ease: "expo.out"
	}, '-=0.9').from('.splash-g-1', imageOpts, '-=0.9')
		.from('.splash-g-2', imageOpts, '-=1.4')
		.from('.splash-g-3', imageOpts, '-=1.3')
		.from('.splash-g-4', imageOpts, '-=1.4').play()
}

interface Props {
	featured_books: Book[]
}

export default function LandingPage({ featured_books }: Props) {
	const isReady = useReady()

	useEffect(() => {
		if (isReady) {
			animatePage()
		}
	}, [isReady])

	return (
		<div className={cn("transition", !isReady && "opacity-0")}>
			<div className={"large-container md:pt-25 pt-20"}>
				<div className="md:text-center max-w-2xl mx-auto">
					<div id="splash-text-container">
						<h1 id="splash-h1" className="font-headline md:text-6xl text-4xl mb-4 leading-none">Read the greatest books of all time. For free.</h1>
						<p id="splash-p" className="md:text-lg text-subtle max-w-md mx-auto mb-6 leading-[1.2]">Access timeless classics from the literary masters. In one beautiful reading app.</p>
						<div id="splash-cta">
							<div className="flex md:flex-row flex-col gap-2 md:justify-center">
								<Button size={"lg"} className={"md:h-11 h-10 px-4 md:text-base md:w-fit w-full"} nativeButton={false} render={<Link href={"/signup"} />}>Create a free account</Button>
								<Button size={"lg"} className={"md:h-11 h-10 px-4 md:text-base md:w-fit w-full"} nativeButton={false} render={<Link href={"/explore"} />} variant={"secondary"}>Explore</Button>
							</div>
							<p className="text-subtle text-sm mt-4">Already a member? <LinkUnderline className="text-foreground">Sign in</LinkUnderline></p>
						</div>
					</div>
				</div>
			</div>
			<div className="relative overflow-hidden">
				<div className="absolute pointer-events-none w-full h-[600px] z-2 bg-linear-to-t from-[var(--color-background)] to-transparent bottom-0 left-0"></div>
				<div className="relative pointer-events-none pt-16">
					<div className="flex md:gap-6 gap-2 relative left-1/2 -translate-x-1/2 md:w-[calc(100%_+_(100%_/_7))] w-[calc(100%_+_(100%_/_4))]">
						<div className="splash-g-4 hidden md:flex flex-col gap-6">
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/v0fjqqnzg0mi10g6bwqmws1i3uj1?tr=w-1000:w-3840,c-at_max" />
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/vddj1o01qmjwlrsty8rqqf55ew3o?tr=w-1000:w-3840,c-at_max" />
						</div>
						<div className="splash-g-3 hidden md:flex flex-col gap-6 md:mt-[48px] mt-2">
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/y66id8u2gi9mko65bihfu5pwph8i?tr=w-1000:w-3840,c-at_max" />
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/j2ezfw8rbknolfzq1nsye6q7o3o6?tr=w-1000:w-3840,c-at_max" />
						</div>
						<div className="splash-g-2 flex flex-col gap-6 md:mt-[96px] mt-4">
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/4i4b6nsr6jkhpywiibwml3hugbcn?tr=w-1000:w-3840,c-at_max" />
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/qy6ic8l4wufmwaj37mf9k1y76u24?tr=w-1000:w-3840,c-at_max" />
						</div>
						<div className="splash-g-1 flex flex-col gap-6 md:mt-[144px] mt-6">
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/wqojc98crukiw0mjryb0r34t2edz?tr=w-1000:w-3840,c-at_max" />
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/wv482vi7jsexty0abh95ijqt9090?tr=w-1000:w-3840,c-at_max" />
						</div>
						<div className="splash-g-2 flex flex-col gap-6 md:mt-[96px] mt-4">
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/d5psgyhhve5hghx6qkcdxtvr2vhf?tr=w-1000:w-3840,c-at_max" />
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/hanbexxqrd8n4a6uo2yf6im7nfqr?tr=w-1000:w-3840,c-at_max" />
						</div>
						<div className="splash-g-3 hidden md:flex flex-col gap-6 md:mt-[48px] mt-2">
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/l7x59ij1e8ruoczw6dy4rsu6mkcl?tr=w-1000:w-3840,c-at_max" />
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/hr5bjpjc9pl52wajyc15dctnwdnl?tr=w-1000:w-3840,c-at_max" />
						</div>
						<div className="splash-g-4 hidden md:flex flex-col gap-6">
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/i38awsouq23u6hha9wcx3iyjdin0?tr=w-1000:w-3840,c-at_max" />
							<img className="md:rounded-lg rounded-md" src="https://ik.imagekit.io/tomes/books/covers/3nw4f9kykomuo3ii9lfzzkgds1ua?tr=w-1000:w-3840,c-at_max" />
						</div>
					</div>
				</div>
			</div>
			<div className="sections flex flex-col gap-50 md:pt-50 pt-30 pb-12">
				<div className="medium-container max-w-7xl">
					<div className="text-center mb-12">
						<h2 className="font-headline md:text-5xl text-3xl max-w-2xl mx-auto mb-4">From beloved masterpieces to hidden gems</h2>
						<p className="text-subtle md:text-lg/6.5 max-w-md mx-auto">Explore the works that shaped literature. Available instantly, anywhere.</p>
					</div>
					<div className="flex items-center justify-between mb-4">
						<h3 className="md:text-lg">Recently added</h3>
						<Link href={"/explore"} className="text-subtle hover:text-foreground transition">See all</Link>
					</div>
					<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
						{featured_books.map(book => <BookCard book={book} key={book.slug} />)}
					</div>
				</div>
				{/* <div className="medium-container max-w-7xl">
					<h2 className="font-headline text-5xl mb-12">Designed for ease of use.</h2>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<div className="aspect-[1.4] rounded-xl border mb-5 flex-center bg-white overflow-hidden">
								<video autoPlay muted loop>
									<source type="video/mp4" src="https://record.club/_nuxt/videos/rc-video-screenshot-queue-720.c453eb2.mp4" />
								</video>
							</div>
							<h4 className="font-medium mb-2">Discover & organize</h4>
							<p className="text-subtle">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt commodi inventore officiis nihil sunt.</p>
						</div>
						<div>
							<div className="aspect-[1.4] rounded-xl border mb-5 flex-center bg-white overflow-hidden">
								<video autoPlay muted loop className="w-[initial] h-[initial]">
									<source type="video/mp4" src="https://record.club/_nuxt/videos/rc-video-screenshot-states-720.967a7c0.mp4" />
								</video>
							</div>
							<h4 className="font-medium mb-2">Set your listening status</h4>
							<p className="text-subtle">Easily add a release to your rotation, mark it as listened, or save it for later by adding it to your queue.</p>
						</div>
					</div>
				</div>

				<div className="medium-container max-w-7xl">
					<h2 className="font-headline text-5xl mb-12">Feature</h2>
				</div> */}
			</div>
		</div>
	)
}

LandingPage.layout = (page: React.ReactNode) => <BaseLayout forceFooterForMobile={true}>{page}</BaseLayout>