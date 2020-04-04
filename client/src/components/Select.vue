<template>
  <div class="select">
    <i class="fas fa-chevron-down" />
    <select
      v-model="model"
      class="cp fs-16 pv-10 text-center color-default"
      @change="onChange"
    >
      <option value="">
        {{ placeholder }}
      </option>
      <option
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        v-text="item.label"
      />
    </select>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: ''
    }
  },
  computed: {
    selected() {
      return this.items.find(item => item.value === this.model)
    },
    label() {
       return this.selected ? this.selected.label : ''
    }
  },
  watch: {
    value: {
      handler(value) {
        this.model = value.value
      },
      immediate: false
    }
  },
  methods: {
    onChange() {
      this.$emit('input', { value: this.model, label: this.label })
    }
  }
}
</script>

<style lang="scss">
.select {
  position: relative;

  i {
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    position: absolute;
  }
}

select {
  background-color: var(--bg-color);
  width: 100%;
  border: 0;
  font-weight: 100;
  outline: 0;
  padding-right: 25px;
  border-bottom: 2px dashed var(--color-muted);
  appearance: none;

  &:hover {
    border-color: var(--color-primary);
  }
}
</style>
