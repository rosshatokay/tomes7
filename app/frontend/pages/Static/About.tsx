import { Badge } from "@/components/ui/badge";
import { AccessibilityIcon, RabbitIcon, UsersIcon } from "lucide-react";

export default function AboutPage() {
	return (
		<article className="pt-12">
			<div className="small-container">
				<Badge variant={"secondary"} className="!w-fit mx-auto block !mb-3 text-subtle md:text-sm h-auto">Welcome to Tomes Club</Badge>
				<h1 className="md:!text-[42px] !text-3xl !mb-6 font-headline max-w-lg mx-auto text-center leading-[1.15]">Classic literature shouldn't feel like a museum piece.</h1>
				<p>The classics shouldn't just sit on dusty shelves or live in clunky, outdated archives. Tomes breathes new life into public domain works by providing a modern, beautiful, and social reading space.</p>
				<p>Literature is a conversation that spans centuries. We built tomes.club to give readers a space where they can rediscover historical masterpieces and share their thoughts with a community of fellow book lovers.</p>
				<p>We focus on:</p>
			</div>
			<div className="max-w-4xl mx-auto px-5 grid md:grid-cols-3 gap-4 my-8">
				<div className="bg-card p-5 rounded-lg">
					<AccessibilityIcon />
					<h3 className="text-xl">Accessibility</h3>
					<p>Making timeless literature free and easy to read.</p>
				</div>
				<div className="bg-card p-5 rounded-lg">
					<UsersIcon />
					<h3 className="text-xl">Community</h3>
					<p>Connecting readers through reviews, follows, and shared discoveries.</p>
				</div>
				<div className="bg-card p-5 rounded-lg">
					<RabbitIcon />
					<h3 className="text-xl">Simplicity</h3>
					<p>A clean, distraction-free environment that puts the focus back on the prose.</p>
				</div>
			</div>
			<div className="small-container">
				<p>Tomes is currently in its early stages, focusing on the core essentials of a digital library. It offers you a library with which you can explore the classics; a platform to share your voice; and a way to build your circle of book-reading friends.</p>
				<h2 className="text-xl mb-2 font-headline">Join the club</h2>
				<p>Whether you're a lifelong fan of the Brontës or just looking for your next great read, there's a place for you here.</p>
				<p>Happy reading, <br /><i className="font-headline">The Tomes Team</i>.</p>
			</div>
			<div className="large-container pt-16">
				<hr />
			</div>
		</article>
	)
}