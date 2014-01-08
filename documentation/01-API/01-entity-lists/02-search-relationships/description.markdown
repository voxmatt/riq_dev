<p>
  What search relationships are for...
</p>

<div class="page-header">
  <h3>Arguments</h3>
</div>
<dl class="dl-horizontal">
  <dt>
    listids
  </dt>
  <dd>
    **required**
    
    the list id within which to search
  </dd>
  <dt>
    excludeMembers
  </dt>
  <dd>
    **optional**
    
    set to 'true' to not return list members, this is preferred as it is much faster and smaller.
  </dd>
  <dt>
    lastModified
  </dt>
  <dd>
    **optional**
    
    only returns lists modified since this date (represented as millis since epoch)
  </dd>
</dl>