/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

})(jQuery);

//To sort the 100 Meter Dash Table
new Tablesort(document.getElementById("100MeterDashResultsTable"));

// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Tablesort
    new Tablesort(document.getElementById('100MeterDashResultsTable'));

    Tablesort.extend('number', function(item) {
        // Return true for items that are integers or decimal numbers
        return item.match(/^[\d.]+$/); // Matches integers and decimal numbers
    }, function(a, b) {
        // Convert to float and compare
        var numA = parseFloat(a);
        var numB = parseFloat(b);

        return numA - numB;
    });
});

//Capture current table and generate a PDF
document.getElementById('downloadUnified100MeterDashPDF').addEventListener('click', function() {
	// Get all header elements
    var headers = document.querySelectorAll('table th');

    // Store original positions and temporarily change to static for pdf generation
    var originalPositions = [];
    headers.forEach(function(header) {
        originalPositions.push(header.style.position);
        header.style.position = 'static';
    });

    html2canvas(document.getElementById('100MeterDashResultsTable'), {
        scale: 0.75, // Adjust the scale as needed
        useCORS: true, // Helps with images if they are present in the table
		
    }).then(canvas => {
        // Create a new jsPDF instance
        var pdf = new jspdf.jsPDF({
            orientation: 'landscape', // Use 'portrait' if the table is not wide
            unit: 'mm',
            format: 'a4'
        });

        // Calculate the width and height of the image to fit the PDF dimensions
        var imgWidth = 210; // A4 width in mm
        var pageHeight = 297;  // A4 height in mm
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;

        var position = 0;

        // Add the image to the PDF
        var imgData = canvas.toDataURL('image/png');
        
        // Check if the image height is larger than PDF page height
        if (heightLeft >= pageHeight) {
            while (heightLeft >= 0) {
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                position -= pageHeight;

                // Avoid adding an extra page at the end
                if (heightLeft > 0) {
                    pdf.addPage();
                }
            }
        } else {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }

        // Save the PDF
        pdf.save("Unified100MeterDashResults.pdf");

		 // Reset headers to original position after pdf generation
		 headers.forEach(function(header, index) {
            header.style.position = originalPositions[index];
        });
    });
});

/*
document.getElementById('downloadUnified100MeterDashPDF').addEventListener('click', function() {
    html2canvas(document.getElementById('100MeterDashResultsTable')).then(canvas => {
        var imgData = canvas.toDataURL('image/png');
        var pdf = new jspdf.jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save("Unified100MeterDashResults.pdf");
    });
});
*/