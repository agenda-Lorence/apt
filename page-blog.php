<?php
/*
Template Name: Page Blog
*/
$post = $wp_query->get_queried_object();
get_header(); ?>

<div id="content">

	<div class="heading">
		<div class="wrapper">
			<h1 class="page-title page-headline"><?php __p(get_field('heading', $post->ID, false)); ?></h1>
		</div>
	</div>


    <section id="blog-surround" class="grid-container">
        <div class="wrapper">
            <div class="grid">
                 
            <?php
                    // WP_Query arguments

                    $blogPaginationPage = get_query_var('paged');

                    $args = array(
                        'category_name'          => blogs,   
                        'posts_per_page'         => '6',
                        'paged'                   => $blogPaginationPage  
                    );

                    // The Query
                    $query = new WP_Query( $args );

                    // The Loop
                    if ( $query->have_posts() ) {
                        while ( $query->have_posts() ) {
                            $query->the_post();

                            $author_id=$post->post_author;
                            // do something
                            ?>
                                <div class="blog-item">
                                    <?php $feat_image = wp_get_attachment_url( get_post_thumbnail_id($post->ID) ); ?>

                                    <div class="post-image" style="background: url('<?php echo $feat_image?>')"></div>

                                    <h2 class="blog-title"><a href='<?php the_permalink() ?>'><?php the_title(); ?></a></h2>

                                    <p class="meta-date"><span class="lbl">Published:</span> <?php the_time('F jS, Y') ?></p>
                                    <p class="meta-author"><?php echo get_avatar( get_the_author_meta( 'ID' ), 32 ); ?> <span class="lbl">Written By</span> <?php the_author(); ?> </p>
                                    <div class="main-text"><?php the_excerpt(); ?></div>

                                </div>
                            <?php
                            
                        } //end while

						echo "<div id=\"paginate\">";
                        echo paginate_links(array(
                            'total' => $query->max_num_pages
                        ));
						echo "</div>";

                        
                    } else {
                        // no posts found
                    }

                    // Restore original Post Data
                    wp_reset_postdata();
                    // End WP_Query arguments      
                ?> 

            </div>
        </div>
    </section>


</div>

<?php get_footer(); ?>