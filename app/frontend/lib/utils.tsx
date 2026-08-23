import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "@inertiajs/react"
import clsx, { type ClassValue } from "clsx"
import React, { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export interface Breadcrumb {
	icon?: React.ReactNode
	label?: string
	path: string
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function createBreadcrumbs(breadcrumbs: Breadcrumb[]) {
	return (
		<div className="breadcrumb-wrapper">
			<Breadcrumb>
				<BreadcrumbList>
					{
						breadcrumbs.map((item, i) => {
							const finalLabel = item.label || (<div className="size-5 flex-center"><div className="breadcrumb-icon size-4 flex-center">{item.icon}</div></div>)
							return (
								<React.Fragment key={i}>
									<BreadcrumbItem>
										{
											(i < breadcrumbs.length - 1)
												? <BreadcrumbLink render={<Link href={item.path}></Link>}>{finalLabel}</BreadcrumbLink>
												: <BreadcrumbPage>{item.label}</BreadcrumbPage>
										}
									</BreadcrumbItem>
									{i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
								</React.Fragment>

							)
						})
					}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}

const copyToClipboard = async (text: string) => {
	// Attempt to use the modern Clipboard API first.
	// This is the preferred method for security and user experience.
	if (navigator.clipboard && window.isSecureContext) {
		// The writeText() method returns a Promise, so we can use async/await
		// to handle the result.
		return navigator.clipboard.writeText(text)
			.then(() => {
				console.log('Text successfully copied to clipboard using the modern API!');
			})
			.catch(err => {
				console.error('Could not copy text to clipboard using the modern API: ', err);
				// Fallback to the traditional method if the modern API fails.
				fallbackCopyToClipboard(text);
			});
	} else {
		// Fallback to the traditional method for non-secure contexts or older browsers.
		console.warn('Clipboard API not available. Falling back to the traditional method.');
		return new Promise<void>((resolve) => {
			fallbackCopyToClipboard(text);
			resolve();
		});
	}
}

/**
 * The fallback function for copying text using a temporary textarea element.
 * This method is less ideal but has broader compatibility.
 *
 * @param {string} text - The string to be copied.
 */
function fallbackCopyToClipboard(text: string) {
	// Create a temporary textarea element
	const textarea = document.createElement('textarea');
	textarea.value = text;

	// Make the textarea invisible and non-interactive
	textarea.style.position = 'fixed';
	textarea.style.top = "0";
	textarea.style.left = "0";
	textarea.style.width = '2em';
	textarea.style.height = '2em';
	textarea.style.padding = "0";
	textarea.style.border = 'none';
	textarea.style.outline = 'none';
	textarea.style.boxShadow = 'none';
	textarea.style.background = 'transparent';
	textarea.readOnly = true;

	// Append the textarea to the document body
	document.body.appendChild(textarea);

	// Select the text within the textarea
	textarea.select();

	try {
		// Execute the copy command
		const successful = document.execCommand('copy');
		if (successful) {
			console.log('Text successfully copied to clipboard using fallback method!');
		} else {
			console.error('Fallback method failed to copy text.');
		}
	} catch (err) {
		console.error('Error in fallback clipboard copy: ', err);
	} finally {
		// Always remove the temporary textarea from the DOM
		document.body.removeChild(textarea);
	}
}

export function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Define the media query matcher
		const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

		// Set initial state value safely on the client side
		setIsMobile(mediaQuery.matches);

		// Define a listener function to handle changes
		const handleMediaQueryChange = (event: any) => {
			setIsMobile(event.matches);
		};

		// Listen for window resize changes matching the query
		mediaQuery.addEventListener('change', handleMediaQueryChange);

		// Clean up event listener when the component unmounts
		return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
	}, [breakpoint]);

	return isMobile;
}

export default copyToClipboard

export function formatBytes(bytes: number, decimals = 2, useSi = true) {
	if (bytes === 0) return '0 Bytes';

	const k = useSi ? 1000 : 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = useSi
		? ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
		: ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function useOperatingSystem() {
	const [os, setOs] = useState<"Unknown" | "macOS" | "iOS" | "Windows" | "Android" | "Linux">('Unknown');

	useEffect(() => {
		// 1. Try modern, privacy-friendly UserAgentData API first
		const nav = window.navigator as any;
		if (nav.userAgentData?.platform) {
			setOs(nav.userAgentData.platform);
			return;
		}

		// 2. Fallback to traditional User Agent string parsing
		const userAgent = window.navigator.userAgent;
		const platform = window.navigator.platform;
		const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
		const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
		const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

		if (macosPlatforms.includes(platform)) {
			setOs('macOS');
		} else if (iosPlatforms.includes(platform)) {
			setOs('iOS');
		} else if (windowsPlatforms.includes(platform)) {
			setOs('Windows');
		} else if (/Android/.test(userAgent)) {
			setOs('Android');
		} else if (/Linux/.test(platform)) {
			setOs('Linux');
		}
	}, []);

	return os;
}

export function SimpleFormat(text: string) {
	if (!text) return null;

	return text.split(/\n\n+/).map((paragraph: string, pIndex: number) => (
		<p key={pIndex}>
			{paragraph.split('\n').map((line, lIndex) => (
				<React.Fragment key={lIndex}>
					{line}
					{lIndex < paragraph.split('\n').length - 1 && <br />}
				</React.Fragment>
			))}
		</p>
	));
}