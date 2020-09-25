<template>
  <div class="row auto-clear">
    <div class="col-sm-6 col-md-4 col-lg-3 cardItem" v-for="(item, index) in data" :key="`Card-${index}`">
      <router-link :to="{ name: detailView, params: { sIdx: item.s_idx, aNo: item.last_a_no, bNo: 1 } }">
        <div class="ibox-title">
          <div>
            <h4 class="no-margins">{{ item.site.company }}</h4>
          </div>
        </div>
        <div class="ibox-content">
          <div class="row customer">
            <div>
              <strong class="hr-stressed">{{ item.site.name }}</strong>
              <small>{{ item.site.part }}</small>
            </div>
            <div>
              <strong class="hr-stressed">{{ item.site.tel }}</strong>
              <small>{{ item.site.email }}</small>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    detailView: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
body .row {
  margin: 0px;
}
.cardItem {
  margin-top: 15px;
  margin-bottom: 15px;
}
@media (min-width: 1200px) {
  .row.auto-clear .col-lg-1:nth-child(12n + 1) {
    clear: left;
  }
  .row.auto-clear .col-lg-2:nth-child(6n + 1) {
    clear: left;
  }
  .row.auto-clear .col-lg-3:nth-child(4n + 1) {
    clear: left;
  }
  .row.auto-clear .col-lg-4:nth-child(3n + 1) {
    clear: left;
  }
  .row.auto-clear .col-lg-6:nth-child(2n + 1) {
    clear: left;
  }
}

@media (min-width: 991px) and (max-width: 1199px) {
  .row.auto-clear .col-md-1:nth-child(12n + 1) {
    clear: left;
  }
  .row.auto-clear .col-md-2:nth-child(6n + 1) {
    clear: left;
  }
  .row.auto-clear .col-md-3:nth-child(4n + 1) {
    clear: left;
  }
  .row.auto-clear .col-md-4:nth-child(3n + 1) {
    clear: left;
  }
  .row.auto-clear .col-md-6:nth-child(2n + 1) {
    clear: left;
  }
}

@media (max-width: 990px) {
  .row.auto-clear .col-sm-1:nth-child(12n + 1) {
    clear: left;
  }
  .row.auto-clear .col-sm-2:nth-child(6n + 1) {
    clear: left;
  }
  .row.auto-clear .col-sm-3:nth-child(4n + 1) {
    clear: left;
  }
  .row.auto-clear .col-sm-4:nth-child(3n + 1) {
    clear: left;
  }
  .row.auto-clear .col-sm-6:nth-child(2n + 1) {
    clear: left;
  }
}
</style>
