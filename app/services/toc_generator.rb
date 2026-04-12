class TocGenerator
  def initialize(book)
    @book = book
    @epub = book.epub
  end

  def generate
    chapters = nil

    @epub.open do |file|
      # We pass the path of the temporary file
      parsed_book = EPUB::Parser.parse(file.path)

      chapters = parsed_book.each_page_on_spine.each_with_index.map do |page, index|
        spine_index = (index + 1) * 2
        cfi_base = "/6/#{spine_index}!"
        doc = page.content_document.nokogiri

        # Strategy: Look for the first H1, then H2, then fallback to <title>
        title = clean_title(doc)

        {
          title: title.strip,
          entry_name: page.entry_name,
          cfi: "epubcfi(#{cfi_base}/4)", # /4 usually points to the <body> of that item. Caution: .read returns the full HTML string. content: page.read
        }
      end
    end

    BookWithToc.find(@book.id).update(toc: chapters)
    chapters
  end

  def clean_title(doc)
    nokogiri_node = doc.at_css("h1") ||
                    doc.at_css("h2") ||
                    doc.at_css("title")

    return "Untitled Section" if nokogiri_node.nil?

    # 1. Get the text content
    text = nokogiri_node.text

    # 2. Fix Encoding (EPUBs can have weird hidden characters)
    text = text.encode("UTF-8", invalid: :replace, undef: :replace, replace: "")

    # 3. Strip HTML tags that might be nested inside (like <span> or <br>)
    # Nokogiri's .text usually does this, but strip_tags is a double-check
    text = ActionView::Base.full_sanitizer.sanitize(text)

    # 4. Squish whitespace
    # This converts "\n  Chapter   1 \n" into "Chapter 1"
    # It handles newlines, tabs, and multiple spaces in one go
    text = text.gsub(/[[:space:]]+/, " ").strip

    # 5. Optional: Remove trailing dots or common "noise"
    # Some books have "Chapter 1......." in the HTML
    text = text.sub(/\.+\z/, "")

    text.presence || "Untitled Section"
  end
end
