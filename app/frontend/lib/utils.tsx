import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "@inertiajs/react"
import clsx, { type ClassValue } from "clsx"
import React from "react"
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

export default copyToClipboard