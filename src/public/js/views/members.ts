declare var $: any;
$(function () {
    const $container = $(".members-list");
    $container.imagesLoaded(function () {
        $container.masonry({ itemSelector: ".member-item" });
    });
    $(".is-tooltip").tooltip();
});