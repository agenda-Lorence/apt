		</div><!-- end #inner -->

	</div><!-- end #outer -->
	<footer>
		<div class="wrapper">
			<?php $args = array(
				'menu' => 'Footer',
				'container' => false
				);

			wp_nav_menu($args); ?>
			<div class="bottom">
				<div class="copyright">
					<p><span class="author">&copy; Apt Wealth Partners Pty Ltd <?php echo date('Y'); ?></span> <span class="abn">ABN 49 159 583 847</span> <span class="afsl">AFSL No 436121</span><br /><br />
 <span class="acl">Apt Wealth Home Loans Pty Ltd ABN 53 618 009 322 is Proudly Powered by Smartline, Australian Credit Licence Number 385325</span></p><p></p>
				</div>

			<div class="canvas">
					<a class="canvaslink" href="http://canvasgroup.com.au" target="_blank">Site by Canvas Group</a>
				</div>	
		</div>
	
		</div>
	</footer>

	<div class="important-container">
		<div class="important-inner">
			<div class="important">
				<h3>Important information</h3>
				<p>This website may contain general advice that does not take into account your financial circumstances, needs and objectives.</p>
				<p>Before making any decision based on this information contained in this website, you should assess your own circumstances or seek advice from a financial adviser and seek tax advice from a registered tax agent. Information is current at the date of issue and may change.</p>
				<div class="close">
					<span></span>
				</div>
			</div>
		</div>
	</div>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="<?php bloginfo("template_url"); ?>/js/libs/jquery/jquery-2.1.1.min.js"><\/script>')</script>

		 <script>
			// jQuery fix - Add to Window object for RequireJS
			<!--
			var APP            = {};
			APP.$              = $;
			window.APP         = APP;
			//-->
			// Add URL to window object for RequireJS baseUrl
			window.APP.templateUrl = '<?php echo get_bloginfo("template_url"); ?>';
			window.APP.homeUrl     = '<?php echo get_bloginfo("url"); ?>';
			window.APP.ajaxUrl = '<?php echo admin_url("admin-ajax.php"); ?>';
		</script>

		<?php wp_footer(); ?>

		<script data-main="<?php bloginfo("template_url"); ?>/build/app-built-v1" src="<?php bloginfo("template_url"); ?>/js/libs/requirejs/require-2.1.9.min.js"></script>

		<!-- <?php echo get_num_queries(); ?> queries. <?php timer_stop(1); ?> seconds. -->
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-43687985-1', 'auto');
			ga('send', 'pageview');
		</script>
</body>
</html>