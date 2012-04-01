# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

(exports ? this).status_chart = (data)->
  w = h = 300
  r = Math.min(w, h) / 2
  console.log(data)
  color = d3.scale.category20c()
  arc = d3.svg.arc().innerRadius(r * .6).outerRadius(r)
  vis = d3.select("body").append("svg")
  vis.data([data])
     .attr("width", w)
     .attr("height", h)
     .append("svg:g")
     .attr("transform", "translate(" + r + "," + r + ")")
  pie = d3.layout.pie()
  pie.value((d)-> return d.value)
  arcs = vis.selectAll("g.arc")
    .data(pie)
    .enter().append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + r + "," + r + ")")
  arcs.append("path")
    .attr("fill", (d, i)-> return color(i))
    .attr("d", arc)
  arcs.append("svg:text")
    .attr("transform", (d)->
      d.innerRadius = 0
      d.outerRadius = r
      "translate(" + arc.centroid(d) + ")")
    .attr("text-anchor", "middle")
    .text((d, i)->data[i].key)
  console.log(data)